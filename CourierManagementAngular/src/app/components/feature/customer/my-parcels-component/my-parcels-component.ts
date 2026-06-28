import { ChangeDetectorRef, Component } from '@angular/core';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';
import { ParcelService } from '../../../../services/parcel.service';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { CustomerResponseModel } from '../../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-parcels-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-parcels-component.html',
  styleUrl: './my-parcels-component.css',
})
export class MyParcelsComponent {
  parcels: ParcelResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus: ParcelStatus | 'ALL' = 'ALL';

  readonly statusOptions = [
    { value: 'ALL' as const,              label: 'All' },
    { value: 'PENDING' as ParcelStatus,   label: 'Pending' },
    { value: 'CONFIRMED' as ParcelStatus, label: 'Confirmed' },
    { value: 'IN_TRANSIT' as ParcelStatus,label: 'In Transit' },
    { value: 'DELIVERED' as ParcelStatus, label: 'Delivered' },
    { value: 'CANCELLED' as ParcelStatus, label: 'Cancelled' },
  ];

  // Detail panel
  showDetail = false;
  detailParcel: ParcelResponse | null = null;

  cancelling = false;

  readonly statusMeta = PARCEL_STATUS_META;
  customerId!: number;

  constructor(
    private parcelService: ParcelService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
   
    const customer = this.storage.getData<CustomerResponseModel>(KEYS.CUSTOMER);
     this.customerId =customer?.id ?? 0;
    this.loadParcels();
  }

  loadParcels(): void {
    this.loading = true;
    this.parcelService.getByCustomer(this.customerId).subscribe({
      next: (res) => { this.parcels = res || []; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.errorMessage = 'Could not load parcels.'; this.loading = false; }
    });
  }

  get filteredParcels(): ParcelResponse[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.parcels.filter(p => {
      const matchStatus = this.selectedStatus === 'ALL' || p.status === this.selectedStatus;
      const matchSearch = !term ||
        p.trackingCode?.toLowerCase().includes(term) ||
        p.receiverName?.toLowerCase().includes(term) ||
        p.receiverPhone?.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }

  badgeClass(status: ParcelStatus): string {
    return this.statusMeta[status]?.badge ?? 'bg-secondary';
  }

  badgeLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }

  openDetail(p: ParcelResponse): void {
    this.detailParcel = p;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailParcel = null;
  }

  canCancel(p: ParcelResponse): boolean {
    return p.status === 'PENDING';
  }

  cancelParcel(p: ParcelResponse): void {
    if (!confirm(`Cancel parcel ${p.trackingCode}?`)) return;
    this.cancelling = true;

    this.parcelService.cancel(p.id, this.customerId).subscribe({
      next: (updated) => {
        const idx = this.parcels.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.parcels[idx] = updated;
        if (this.detailParcel?.id === updated.id) this.detailParcel = updated;
        this.cancelling = false;
        this.cdr.markForCheck();
      },
      error: () => {
        alert('Cancellation failed. Only PENDING parcels can be cancelled.');
        this.cancelling = false;
      }
    });
  }
}
