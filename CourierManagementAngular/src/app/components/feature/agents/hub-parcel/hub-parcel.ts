import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ParcelResponse,
  ParcelStatus,
  StatusUpdateRequest,
  PARCEL_STATUS_META
} from '../../../../models/parcel.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../../services/agent.service';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AgentResponseModel } from '../../../../models/agent.model';


@Component({
  selector: 'app-hub-parcel',
  imports: [CommonModule, FormsModule],
  templateUrl: './hub-parcel.html',
  styleUrl: './hub-parcel.css',
})
export class HubParcel {


  agentId!: number;

  // ── List state ──────────────────────────────────────────────────
  parcels: ParcelResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  // ── Filters ─────────────────────────────────────────────────────
  searchTerm = '';
  selectedStatus: ParcelStatus | 'ALL' = 'ALL';

  readonly statusOptions: { value: ParcelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Parcels' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'AT_HUB', label: 'At Hub' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'FAILED_DELIVERY', label: 'Failed Delivery' },
    { value: 'RETURNED', label: 'Returned' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // ── Status update panel ─────────────────────────────────────────
  showPanel = false;
  selectedParcel: ParcelResponse | null = null;

  updateDto: StatusUpdateRequest = {
    status: 'PENDING',
    note: '',
    location: ''
  };

  saving = false;
  updateError: string | null = null;

  // ── Detail modal ────────────────────────────────────────────────
  showDetail = false;
  detailParcel: ParcelResponse | null = null;

  readonly statusMeta = PARCEL_STATUS_META;

  agent: AgentResponseModel | null = null;

  constructor(
    private agentService: AgentService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Read agentId from the encrypted session
    const agent = this.storage.getData<AgentResponseModel>(KEYS.AGENT);
    const user = this.storage.getUser();
    this.agentId = agent?.id ?? 0;
    this.loadParcels();
  }

  // ── Load ─────────────────────────────────────────────────────────

  loadParcels(): void {
    this.loading = true;
    this.errorMessage = null;

    const call$ = this.selectedStatus === 'ALL'
      ? this.agentService.getHubParcels(this.agentId)
      : this.agentService.getHubParcelsByStatus(this.agentId, this.selectedStatus);

    call$.subscribe({
      next: (res) => {
        this.parcels = res || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load parcels. Please try again.';
        this.loading = false;
      }
    });
  }

  onStatusFilterChange(): void {
    this.loadParcels();
  }

  // ── Client-side text search ───────────────────────────────────────

  get filteredParcels(): ParcelResponse[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.parcels;

    return this.parcels.filter(p =>
      p.trackingCode?.toLowerCase().includes(term) ||
      p.senderName?.toLowerCase().includes(term) ||
      p.senderPhone?.toLowerCase().includes(term) ||
      p.receiverName?.toLowerCase().includes(term) ||
      p.receiverPhone?.toLowerCase().includes(term)
    );
  }

  badgeClass(status: ParcelStatus): string {
    return this.statusMeta[status]?.badge ?? 'bg-secondary';
  }

  badgeLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }

  // ── Detail modal ──────────────────────────────────────────────────

  openDetail(parcel: ParcelResponse): void {
    this.detailParcel = parcel;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detailParcel = null;
  }

  // ── Status update panel ───────────────────────────────────────────

  openUpdatePanel(parcel: ParcelResponse): void {
    this.selectedParcel = parcel;
    this.updateDto = {
      status: parcel.status,
      note: '',
      location: ''
    };
    this.updateError = null;
    this.showPanel = true;
  }

  closePanel(): void {
    this.showPanel = false;
    this.selectedParcel = null;
  }

  submitStatusUpdate(): void {
    if (!this.selectedParcel) return;
    this.saving = true;
    this.updateError = null;

    this.agentService
      .updateParcelStatus(this.agentId, this.selectedParcel.id, this.updateDto)
      .subscribe({
        next: (updated) => {
          // Patch the updated parcel in the local list
          const idx = this.parcels.findIndex(p => p.id === updated.id);
          if (idx !== -1) this.parcels[idx] = updated;

          this.saving = false;
          this.closePanel();
          this.cdr.markForCheck();
        },
        error: () => {
          this.updateError = 'Failed to update status. Please try again.';
          this.saving = false;
        }
      });
  }


}
