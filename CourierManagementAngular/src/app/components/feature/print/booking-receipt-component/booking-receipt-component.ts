import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ParcelResponse } from '../../../../models/parcel.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-receipt',
  imports: [CommonModule],
  templateUrl: './booking-receipt-component.html',
  styleUrl: './booking-receipt-component.css',
})
export class BookingReceiptComponent {


   @Input() parcel!: ParcelResponse;

  /** Emits when the user wants to book another parcel */
  @Output() bookAnother = new EventEmitter<void>();

  @ViewChild('receiptRoot') receiptRoot!: ElementRef<HTMLElement>;

  today = new Date();

  print(): void {
    const receiptHtml = this.receiptRoot.nativeElement.innerHTML;

    // Pull in the component's own stylesheet content (and any global ones you want)
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch {
          // Cross-origin stylesheets (e.g. CDN fonts) will throw — skip them
          return '';
        }
      })
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${this.parcel?.trackingCode ?? ''}</title>
          <style>${styles}</style>
          <style>
            body { margin: 0; padding: 1cm 1.5cm; font-family: 'Segoe UI', sans-serif; }
            @page { size: A4; margin: 1cm; }
          </style>
        </head>
        <body>
          ${receiptHtml}
        </body>
      </html>
    `);
    doc.close();

    // Wait for content (and any images/fonts) to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  }
}
