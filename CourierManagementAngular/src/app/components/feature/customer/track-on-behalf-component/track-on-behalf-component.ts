import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerResponseModel } from '../../../../models/customer.model';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';
import { ParcelService } from '../../../../services/parcel.service';
import { CustomerService } from '../../../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-on-behalf-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './track-on-behalf-component.html',
  styleUrl: './track-on-behalf-component.css',
})
export class TrackOnBehalfComponent {

  // ── Customer search ────────────────────────────────────────────
  customers: CustomerResponseModel[] = [];
  customerSearchTerm = '';
  customersLoading = true;
  customersError: string | null = null;

  selectedCustomer: CustomerResponseModel | null = null;

  // ── Customer's parcels ────────────────────────────────────────
  parcels: ParcelResponse[] = [];
  parcelsLoading = false;
  parcelSearchTerm = '';
  selectedStatus: ParcelStatus | 'ALL' = 'ALL';

  readonly statusOptions: { value: ParcelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'AT_HUB', label: 'At Hub' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // ── Tracking detail panel ────────────────────────────────────
  showDetail = false;
  detailParcel: ParcelResponse | null = null;

  // Steps for the visual progress stepper
  readonly steps: ParcelStatus[] = [
    'PENDING', 'PICKED_UP', 'IN_TRANSIT', 'AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED'
  ];

  readonly statusMeta = PARCEL_STATUS_META;

  constructor(
    private parcelService: ParcelService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ── Step 1: load + search customers ───────────────────────────

  loadCustomers(): void {
    this.customersLoading = true;
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.customers = res || [];
        this.customersLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.customersError = 'Could not load customers.';
        this.customersLoading = false;
      }
    });
  }

  get filteredCustomers(): CustomerResponseModel[] {
    const term = this.customerSearchTerm.trim().toLowerCase();
    if (!term) return [];
    return this.customers.filter(c =>
      c.name?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term)
    ).slice(0, 8);
  }

  selectCustomer(customer: CustomerResponseModel): void {
    this.selectedCustomer = customer;
    this.customerSearchTerm = '';
    if (customer.id) {
      this.loadParcelsForCustomer(customer.id);
    }


  }

  clearCustomer(): void {
    this.selectedCustomer = null;
    this.parcels = [];
    this.parcelSearchTerm = '';
    this.selectedStatus = 'ALL';
  }

  // ── Step 2: load that customer's parcels ───────────────────────

  loadParcelsForCustomer(customerId: number): void {
    this.parcelsLoading = true;
    this.parcelService.getByCustomer(customerId).subscribe({
      next: (res) => {
        this.parcels = res || [];
        this.parcelsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.parcelsLoading = false; this.parcels = []; }
    });
  }

  get filteredParcels(): ParcelResponse[] {
    const term = this.parcelSearchTerm.trim().toLowerCase();
    return this.parcels.filter(p => {
      const matchStatus = this.selectedStatus === 'ALL' || p.status === this.selectedStatus;
      const matchSearch = !term ||
        p.trackingCode?.toLowerCase().includes(term) ||
        p.receiverName?.toLowerCase().includes(term) ||
        p.receiverPhone?.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }

  badgeClass(s: ParcelStatus): string { return this.statusMeta[s]?.badge ?? 'bg-secondary'; }
  badgeLabel(s: ParcelStatus): string { return this.statusMeta[s]?.label ?? s; }

  // ── Step 3: view tracking detail ────────────────────────────────

  openDetail(parcel: ParcelResponse): void {
    this.detailParcel = parcel;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailParcel = null;
  }

  stepIndex(status: ParcelStatus): number { return this.steps.indexOf(status); }

  currentStepIndex(): number {
    if (!this.detailParcel) return -1;
    if (['CANCELLED', 'RETURNED', 'FAILED_DELIVERY'].includes(this.detailParcel.status)) return -1;
    return this.stepIndex(this.detailParcel.status as ParcelStatus);
  }


}
