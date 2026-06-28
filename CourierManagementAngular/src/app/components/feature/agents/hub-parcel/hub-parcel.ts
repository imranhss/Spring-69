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
import { PolicestationService } from '../../../../services/policestation.service';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { ZoneService } from '../../../../services/zone.service';
import { RiderService } from '../../../../services/rider.service';
import { RiderResponseDTO } from '../../../../models/zone.model';


@Component({
  selector: 'app-hub-parcel',
  imports: [CommonModule, FormsModule],
  templateUrl: './hub-parcel.html',
  styleUrl: './hub-parcel.css',
})
export class HubParcel {



  agentId!: number;

  // ── List ─────────────────────────────────────────────────────────
  parcels: ParcelResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  searchTerm = '';
  selectedStatus: ParcelStatus | 'ALL' = 'ALL';

  readonly statusOptions: { value: ParcelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Parcels' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'RETURNED', label: 'Returned' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // ── Status update panel ───────────────────────────────────────────
  showPanel = false;
  selectedParcel: ParcelResponse | null = null;
  updateDto: StatusUpdateRequest = { status: 'PENDING', note: '', location: '', riderId: null };
  saving = false;
  updateError: string | null = null;

  // ── Rider selection (shown when OUT_FOR_DELIVERY) ─────────────────
  availableRiders: any[] = [];
  ridersLoading = false;

  // ── Hub transfer cascade (shown when IN_TRANSIT) ──────────────────
  transitCountries: any[] = [];
  transitDivisions: any[] = [];
  transitDistricts: any[] = [];
  transitStations: any[] = [];
  transitCountryId: number | null = null;
  transitDivisionId: number | null = null;
  transitDistrictId: number | null = null;

  // ── Detail panel ─────────────────────────────────────────────────
  showDetail = false;
  detailParcel: ParcelResponse | null = null;

  readonly statusMeta = PARCEL_STATUS_META;

  constructor(
    private agentService: AgentService,
    private storage: StorageService,
    private psService: PolicestationService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private zoneService: ZoneService,
    private riderService: RiderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.resolveAgentThenLoad();
  }

  private resolveAgentThenLoad(): void {
    const cached = this.storage.getData<any>(KEYS.AGENT);
    if (cached?.id) {
      this.agentId = cached.id;
      this.loadCountries();
      this.loadParcels();
      this.loadRiders();
      return;
    }

    const user = this.storage.getUser();
    if (!user?.userId) {
      this.errorMessage = 'Could not identify agent. Please log out and log in again.';
      this.loading = false;
      return;
    }

    this.agentService.findByUserId(user.userId).subscribe({
      next: (agent) => {
        this.storage.saveData(KEYS.AGENT, agent);
        this.agentId = agent.id;
        this.loadCountries();
        this.loadParcels();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Could not load agent profile. Please try again.';
        this.loading = false;
      }
    });
  }

  // ── Load Riders ──────────────────────────────────────────────────

  loadRiders(): void {
    const agent = this.storage.getData<any>(KEYS.AGENT);
    const hubId = agent?.hubId;

    if (!hubId) {
      console.warn('Agent hubId (police station ID) not found in storage.');
      return;
    }

    this.ridersLoading = true;
    this.zoneService.getActiveRidersForPoliceStation(hubId).subscribe({
      next: (riders) => {
        this.availableRiders = riders || [];
        this.ridersLoading = false;
        console.log('Riders loaded:', this.availableRiders); // ← log here instead
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.ridersLoading = false;
        console.error('Failed to load riders', err);
      }
    });
  }

  // ── Load parcels ──────────────────────────────────────────────────

  loadParcels(): void {
    this.loading = true;
    this.errorMessage = null;

    const call$ = this.selectedStatus === 'ALL'
      ? this.agentService.getHubParcels(this.agentId)
      : this.agentService.getHubParcelsByStatus(this.agentId, this.selectedStatus);

    call$.subscribe({
      next: (res) => { this.parcels = res || []; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.errorMessage = 'Could not load parcels. Please try again.'; this.loading = false; }
    });
  }

  onStatusFilterChange(): void { this.loadParcels(); }

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

  badgeClass(s: ParcelStatus): string { return this.statusMeta[s]?.badge ?? 'bg-secondary'; }
  badgeLabel(s: ParcelStatus): string { return this.statusMeta[s]?.label ?? s; }

  // ── Detail panel ──────────────────────────────────────────────────

  openDetail(parcel: ParcelResponse): void {
    this.detailParcel = parcel; this.showDetail = true;
    console.log(this.detailParcel);
    
  }
  closeDetail(): void { this.showDetail = false; this.detailParcel = null; }

  // ── Status update panel ───────────────────────────────────────────

  openUpdatePanel(parcel: ParcelResponse): void {
    this.selectedParcel = parcel;
    this.updateDto = { status: parcel.status, note: '', location: '', riderId: null, nextHubPoliceStationId: null };
    this.updateError = null;

    this.resetTransitCascade();
    this.showPanel = true;
    this.loadRiders();
    console.log(this.availableRiders + "11111111111111111111");

  }

  closePanel(): void { this.showPanel = false; this.selectedParcel = null; }

  // Called when the "New Status" select changes inside the panel
  onNewStatusChange(): void {
    this.updateDto.riderId = null;
    this.updateDto.nextHubPoliceStationId = null;
    this.resetTransitCascade();

    if (this.updateDto.status === 'OUT_FOR_DELIVERY') {
      this.loadRidersForDestination();
    }
  }

  // ── Rider selection ───────────────────────────────────────────────

  private loadRidersForDestination(): void {
    if (!this.selectedParcel?.destinationPoliceStation) return;

    // Use the parcel's destination police station to find available riders.
    // We need the station ID — it's available on the parcel if the backend returns it,
    // otherwise fall back to searching by name (less reliable).
    // Here we pull it from the parcel model directly if exposed, 
    // otherwise use the GET /rider-zones/police-station/{id}/active endpoint.
    const stationId = (this.selectedParcel as any).destinationPoliceStationId
      ?? (this.selectedParcel as any).destinationPsId;

    if (!stationId) {
      // Station ID not in response — still show the field, riders load when agent picks a station
      return;
    }

    this.ridersLoading = true;
    this.agentService.getActiveRidersForStation(stationId).subscribe({
      next: (riders) => { this.availableRiders = riders || []; this.ridersLoading = false; this.cdr.markForCheck(); },
      error: () => { this.ridersLoading = false; }
    });
  }

  // ── Hub transfer cascade (IN_TRANSIT) ────────────────────────────

  loadCountries(): void {
    this.countryService.getAll().subscribe(data => { this.transitCountries = data; });
  }

  resetTransitCascade(): void {
    this.transitDivisions = []; this.transitDistricts = []; this.transitStations = [];
    this.transitCountryId = null; this.transitDivisionId = null; this.transitDistrictId = null;
    this.updateDto.nextHubPoliceStationId = null;
  }

  onTransitCountryChange(): void {
    this.transitDivisions = []; this.transitDistricts = []; this.transitStations = [];
    this.transitDivisionId = null; this.transitDistrictId = null;
    this.updateDto.nextHubPoliceStationId = null;
    if (!this.transitCountryId) return;
    this.divisionService.getByCountryId(this.transitCountryId).subscribe(r => { this.transitDivisions = r; this.cdr.markForCheck(); });
  }

  onTransitDivisionChange(): void {
    this.transitDistricts = []; this.transitStations = [];
    this.transitDistrictId = null; this.updateDto.nextHubPoliceStationId = null;
    if (!this.transitDivisionId) return;
    this.districtService.getByDivisionId(this.transitDivisionId).subscribe(r => { this.transitDistricts = r; this.cdr.markForCheck(); });
  }

  onTransitDistrictChange(): void {
    this.transitStations = []; this.updateDto.nextHubPoliceStationId = null;
    if (!this.transitDistrictId) return;
    this.psService.getByDistrictId(this.transitDistrictId).subscribe(r => { this.transitStations = r; this.cdr.markForCheck(); });
  }

  // ── Submit ────────────────────────────────────────────────────────

  submitStatusUpdate(): void {
    if (!this.selectedParcel) return;
    this.saving = true;
    this.updateError = null;

    this.agentService
      .updateParcelStatus(this.agentId, this.selectedParcel.id, this.updateDto)
      .subscribe({
        next: (updated) => {
          const idx = this.parcels.findIndex(p => p.id === updated.id);
          if (idx !== -1) this.parcels[idx] = updated;
          this.saving = false;
          this.closePanel();
          this.cdr.markForCheck();
        },
        error: () => { this.updateError = 'Failed to update status. Please try again.'; this.saving = false; }
      });
  }

}
