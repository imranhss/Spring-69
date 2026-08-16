import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus, StatusUpdateRequest } from '../../../../models/parcel.model';
import { ParcelService } from '../../../../services/parcel.service';
import { RiderService } from '../../../../services/rider.service';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { LoginResponse } from '../../../../models/auth.model';
import { RiderResponseModel } from '../../../../models/rider.model';

/** The next forward status a rider can move a parcel to, keyed by its current status. */
const NEXT_STATUS: Partial<Record<ParcelStatus, { status: ParcelStatus; label: string; icon: string }>> = {
  PICKED_UP: { status: 'IN_TRANSIT', label: 'Mark In Transit', icon: 'bi-truck' },
  IN_TRANSIT: { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'bi-signpost-split' },
  OUT_FOR_DELIVERY: { status: 'DELIVERED', label: 'Mark Delivered', icon: 'bi-check-circle' },
};

@Component({
  selector: 'app-rider-deliveries',
  imports: [CommonModule, FormsModule],
  templateUrl: './rider-deliveries.html',
  styleUrl: './rider-deliveries.css',
})
export class RiderDeliveries {
  user: LoginResponse | null = null;
  userId!: number;
  rider: RiderResponseModel | null = null;
  riderId!: number;

  parcels: ParcelResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus: ParcelStatus | 'ALL' = 'ALL';

  readonly statusOptions: { value: ParcelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'ASSIGNED' as ParcelStatus, label: 'Assigned' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
  ];

  readonly statusMeta = PARCEL_STATUS_META;

  // Detail panel
  showDetail = false;
  detailParcel: ParcelResponse | null = null;

  // Action state
  updating = false;
  updateError: string | null = null;
  note = '';
  location = '';
  showReturnOption = false;

  constructor(
    private parcelService: ParcelService,
    private riderService: RiderService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.storage.getUser();
    if (this.user?.userId) this.userId = this.user.userId;

    const cached = this.storage.getData<RiderResponseModel>(KEYS.RIDER);
    if (cached?.id) {
      this.rider = cached;
      this.riderId = cached.id;
      this.loadParcels();
    } else {
      this.loadRiderThenParcels();
    }
  }

  private loadRiderThenParcels(): void {
    this.riderService.findByUserId(this.userId).subscribe({
      next: (res) => {
        this.rider = res;
        this.riderId = res.id;
        this.storage.saveData(KEYS.RIDER, res);
        this.loadParcels();
      },
      error: () => {
        this.errorMessage = 'Could not load your rider profile.';
        this.loading = false;
      },
    });
  }

  loadParcels(): void {
    this.loading = true;
    this.errorMessage = null;
    this.parcelService.getByRider(this.riderId).subscribe({
      next: (res) => {
        this.parcels = (res || []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load your deliveries.';
        this.loading = false;
      },
    });
  }

  get filteredParcels(): ParcelResponse[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.parcels.filter((p) => {
      const matchStatus = this.selectedStatus === 'ALL' || p.status === this.selectedStatus;
      const matchSearch =
        !term ||
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

  /** The forward action available for a parcel's current status, if any. */
  nextAction(p: ParcelResponse) {
    return NEXT_STATUS[p.status];
  }

  canReturn(p: ParcelResponse): boolean {
    return p.status === 'OUT_FOR_DELIVERY';
  }

  openDetail(p: ParcelResponse): void {
    this.detailParcel = p;
    this.showDetail = true;
    this.note = '';
    this.location = '';
    this.updateError = null;
    this.showReturnOption = false;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailParcel = null;
  }

  /** Rider picks up an ASSIGNED parcel from the sender. */
  markPickedUp(p: ParcelResponse): void {
    this.updating = true;
    this.updateError = null;
    this.parcelService.pickup(p.id, this.riderId, this.note, this.location).subscribe({
      next: (updated) => this.applyUpdate(updated),
      error: (err) => this.handleError(err),
    });
  }

  /** Rider progresses a parcel to the next status (in transit / out for delivery / delivered). */
  advanceStatus(p: ParcelResponse): void {
    const next = this.nextAction(p);
    if (!next) return;
    this.runStatusUpdate(p, next.status);
  }

  /** Rider reports the parcel as returned (e.g. receiver unavailable). */
  markReturned(p: ParcelResponse): void {
    if (!confirm(`Mark parcel ${p.trackingCode} as returned?`)) return;
    this.runStatusUpdate(p, 'RETURNED');
  }

  private runStatusUpdate(p: ParcelResponse, status: ParcelStatus): void {
    this.updating = true;
    this.updateError = null;
    const dto: StatusUpdateRequest = {
      status,
      note: this.note || undefined,
      location: this.location || undefined,
      riderId: this.riderId,
    };
    this.parcelService.updateStatus(p.id, dto).subscribe({
      next: (updated) => this.applyUpdate(updated),
      error: (err) => this.handleError(err),
    });
  }

  private applyUpdate(updated: ParcelResponse): void {
    const idx = this.parcels.findIndex((x) => x.id === updated.id);
    if (idx !== -1) this.parcels[idx] = updated;
    if (this.detailParcel?.id === updated.id) this.detailParcel = updated;
    this.note = '';
    this.location = '';
    this.updating = false;
    this.showReturnOption = false;
    this.cdr.markForCheck();
  }

  private handleError(err: any): void {
    this.updateError = err?.error?.message || 'Update failed. Please try again.';
    this.updating = false;
    this.cdr.markForCheck();
  }
}
