import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginResponse } from '../../../models/auth.model';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../models/parcel.model';
import { AgentService } from '../../../services/agent.service';
import { RiderService } from '../../../services/rider.service';
import { ParcelService } from '../../../services/parcel.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  user: LoginResponse | null = null;

  // ── Stats ─────────────────────────────────────────────────────
  totalParcels   = 0;
  totalAgents    = 0;
  totalRiders    = 0;
  pendingParcels = 0;
  inTransit      = 0;
  delivered      = 0;

  allParcels: ParcelResponse[] = [];     // full dataset, kept so filters can re-slice it
  recentParcels: ParcelResponse[] = [];  // filtered + sliced view shown in the table

  // ── Filters ───────────────────────────────────────────────────
  hubOptions: string[] = [];
  selectedHub: string = '';
  selectedStatus: ParcelStatus | '' = '';

  loading = true;
  readonly statusMeta = PARCEL_STATUS_META;
  readonly statusOptions: ParcelStatus[] = Object.keys(PARCEL_STATUS_META) as ParcelStatus[];

  constructor(
    private agentService: AgentService,
    private riderService: RiderService,
    private parcelService: ParcelService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Load agents count
    this.agentService.getAllAgents().subscribe({
      next: (res) => { this.totalAgents = res?.length ?? 0; this.cdr.markForCheck(); },
      error: () => {}
    });

    // Load riders count
    this.riderService.getAll().subscribe({
      next: (res) => { this.totalRiders = res?.length ?? 0; this.cdr.markForCheck(); },
      error: () => {}
    });

    // Load all parcels → compute stats + recent list
    this.parcelService.getAll().subscribe({
      next: (res) => {
        const parcels = res || [];
        this.allParcels = parcels;

        this.totalParcels   = parcels.length;
        this.pendingParcels = parcels.filter(p => p.status === 'PENDING').length;
        this.inTransit      = parcels.filter(p => p.status === 'IN_TRANSIT' || p.status === 'AT_HUB').length;
        this.delivered      = parcels.filter(p => p.status === 'DELIVERED').length;

        // Build the hub dropdown from whatever hubs actually appear in the data
        this.hubOptions = Array.from(
          new Set(parcels.map(p => p.originPoliceStation).filter((h): h is string => !!h))
        ).sort();

        this.applyFilters();

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allParcels];

    const isFiltered = !!this.selectedHub || !!this.selectedStatus;

    if (this.selectedHub) {
      filtered = filtered.filter(p =>
        p.originPoliceStation === this.selectedHub ||
        p.destinationPoliceStation === this.selectedHub
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    const sorted = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Unfiltered → only the 8 most recent ("recent activity" feed)
    // Filtered    → show every match
    this.recentParcels = isFiltered ? sorted : sorted.slice(0, 8);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedHub = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  badgeClass(status: ParcelStatus): string {
    return this.statusMeta[status]?.badge ?? 'bg-secondary';
  }

  badgeLabel(status: ParcelStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

}