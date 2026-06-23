import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RiderResponseModel } from '../../../../models/rider.model';
import { RiderService } from '../../../../services/rider.service';
import { RiderzoneService } from '../../../../services/riderzone.service';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { PolicestationService } from '../../../../services/policestation.service';

@Component({
  selector: 'app-riderlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './riderlist.html',
  styleUrl: './riderlist.css',
})
export class Riderlist {

 // =========================
  // LIST STATE
  // =========================
 
  riders: RiderResponseModel[] = [];
  loading = true;
  errorMessage: string | null = null;
 
  // Search
  searchTerm = '';
 
  // =========================
  // ZONE MODAL STATE
  // =========================
 
  showModal = false;
  modalRider: RiderResponseModel | null = null;
 
  // Rider's currently assigned zones (loaded fresh when modal opens)
  assignedZones: any[] = [];
  zonesLoading = false;
 
  // Location cascade for assigning a new zone
  countries: any[] = [];
  divisions: any[] = [];
  districts: any[] = [];
  policeStations: any[] = [];
 
  selectedCountryId: number | null = null;
  selectedDivisionId: number | null = null;
  selectedDistrictId: number | null = null;
 
  // Police stations selected to add (multi-select via checkboxes)
  selectedToAdd: Set<number> = new Set();
 
  // Police stations selected to remove
  selectedToRemove: Set<number> = new Set();
 
  saving = false;
 
  constructor(
    private riderService: RiderService,
    private riderZoneService: RiderzoneService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private policeStationService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.loadRiders();
    this.loadCountries();
  }
 
  // =========================
  // RIDERS
  // =========================
 
  loadRiders(): void {
    this.loading = true;
    this.errorMessage = null;
 
    this.riderService.getAll().subscribe({
      next: (res) => {
        this.riders = res || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Could not load riders. Please try again.';
        this.loading = false;
      }
    });
  }
 
  get filteredRiders(): RiderResponseModel[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.riders;
 
    return this.riders.filter(r =>
      r.name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.phone?.toLowerCase().includes(term) ||
      r.vehicleType?.toLowerCase().includes(term)
    );
  }
 
  deleteRider(rider: RiderResponseModel): void {
    if (!confirm(`Delete rider "${rider.name}"? This cannot be undone.`)) return;
 
    this.riderService.delete(rider.id).subscribe({
      next: () => {
        this.riders = this.riders.filter(r => r.id !== rider.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete rider.');
      }
    });
  }
 
  getRiderImage(rider: RiderResponseModel): string | null {
    return rider.image || null;
  }
 
  onImageError(rider: any): void {
    rider._imageError = true;
  }
 
  // =========================
  // LOCATION CASCADE (for modal)
  // =========================
 
  loadCountries(): void {
    this.countryService.getAll().subscribe(data => {
      this.countries = data;
      this.cdr.markForCheck();
    });
  }
 
  onCountryChange(): void {
    this.divisions = [];
    this.districts = [];
    this.policeStations = [];
    this.selectedDivisionId = null;
    this.selectedDistrictId = null;
    this.selectedToAdd.clear();
 
    if (!this.selectedCountryId) return;
 
    this.divisionService.getByCountryId(this.selectedCountryId).subscribe(res => {
      this.divisions = res;
      this.cdr.markForCheck();
    });
  }
 
  onDivisionChange(): void {
    this.districts = [];
    this.policeStations = [];
    this.selectedDistrictId = null;
    this.selectedToAdd.clear();
 
    if (!this.selectedDivisionId) return;
 
    this.districtService.getByDivisionId(this.selectedDivisionId).subscribe(res => {
      this.districts = res;
      this.cdr.markForCheck();
    });
  }
 
  onDistrictChange(): void {
    this.policeStations = [];
    this.selectedToAdd.clear();
 
    if (!this.selectedDistrictId) return;
 
    this.policeStationService.getByDistrictId(this.selectedDistrictId).subscribe(res => {
      // Filter out already-assigned zones so the list only shows new options
      const assignedIds = new Set(this.assignedZones.map((z: any) => z.id));
      this.policeStations = res.filter((p: any) => !assignedIds.has(p.id));
      this.cdr.markForCheck();
    });
  }
 
  toggleAddSelection(id: number): void {
    this.selectedToAdd.has(id)
      ? this.selectedToAdd.delete(id)
      : this.selectedToAdd.add(id);
  }
 
  toggleRemoveSelection(id: number): void {
    this.selectedToRemove.has(id)
      ? this.selectedToRemove.delete(id)
      : this.selectedToRemove.add(id);
  }
 
  // =========================
  // MODAL
  // =========================
 
  openModal(rider: RiderResponseModel): void {
    this.modalRider = rider;
    this.showModal = true;
    this.selectedToAdd = new Set();
    this.selectedToRemove = new Set();
    this.policeStations = [];
    this.selectedDistrictId = null;
    this.selectedDivisionId = null;
    this.selectedCountryId = null;
    this.loadAssignedZones(rider.id);
  }
 
  closeModal(): void {
    this.showModal = false;
    this.modalRider = null;
    this.assignedZones = [];
  }
 
  loadAssignedZones(riderId: number): void {
    this.zonesLoading = true;
 
    this.riderZoneService.getZonesForRider(riderId).subscribe({
      next: (res) => {
        this.assignedZones = res || [];
        this.zonesLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.zonesLoading = false;
      }
    });
  }
 
  // =========================
  // ADD ZONES
  // =========================
 
  addZones(): void {
    if (!this.modalRider || this.selectedToAdd.size === 0) return;
    this.saving = true;
 
    this.riderZoneService.addZones(this.modalRider.id, this.selectedToAdd).subscribe({
      next: (updated) => {
        // Sync local rider card with fresh zone list
        const idx = this.riders.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.riders[idx] = updated;
 
        this.selectedToAdd = new Set();
        this.policeStations = [];
        this.selectedDistrictId = null;
        this.saving = false;
 
        // Reload assigned zones panel
        this.loadAssignedZones(this.modalRider!.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add zones.');
        this.saving = false;
      }
    });
  }
 
  // =========================
  // REMOVE ZONES
  // =========================
 
  removeZones(): void {
    if (!this.modalRider || this.selectedToRemove.size === 0) return;
    this.saving = true;
 
    this.riderZoneService.removeZones(this.modalRider.id, this.selectedToRemove).subscribe({
      next: (updated) => {
        const idx = this.riders.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.riders[idx] = updated;
 
        this.selectedToRemove = new Set();
        this.saving = false;
 
        this.loadAssignedZones(this.modalRider!.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to remove zones.');
        this.saving = false;
      }
    });
  }


}
