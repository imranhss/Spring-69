import { ChangeDetectorRef, Component } from '@angular/core';
import { RiderRequestModel, ZoneSummary } from '../../../../models/rider.model';
import { RiderService } from '../../../../services/rider.service';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-rider',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-rider.html',
  styleUrl: './add-rider.css',
})
export class AddRider {

// =========================
  // LOCATION DROPDOWN DATA
  // =========================
 
  countries: any[] = [];
  divisions: any[] = [];
  districts: any[] = [];
  policeStations: any[] = [];
 
  selectedCountryId: number | null = null;
  selectedDivisionId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedPoliceStationId: number | null = null;
 
  // =========================
  // RIDER FORM DATA
  // =========================
 
  rider: RiderRequestModel = {
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: '',
    vehicleNumber: '',
    nidNumber: '',
    zones: []
  };
 
  selectedFile: File | null = null;
  imagePreview: any = null;
 
  // Password UI state
  confirmPassword: string = '';
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;
 
  constructor(
    private riderService: RiderService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private policeStationService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.loadCountries();
  }
 
  // =========================
  // LOCATION CASCADE
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
    this.selectedPoliceStationId = null;
 
    if (!this.selectedCountryId) return;
 
    this.divisionService.getByCountryId(this.selectedCountryId)
      .subscribe(res => {
        this.divisions = res;
        this.cdr.markForCheck();
      });
  }
 
  onDivisionChange(): void {
    this.districts = [];
    this.policeStations = [];
 
    this.selectedDistrictId = null;
    this.selectedPoliceStationId = null;
 
    if (!this.selectedDivisionId) return;
 
    this.districtService.getByDivisionId(this.selectedDivisionId)
      .subscribe(res => {
        this.districts = res;
        this.cdr.markForCheck();
      });
  }
 
  onDistrictChange(): void {
    this.policeStations = [];
    this.selectedPoliceStationId = null;
 
    if (!this.selectedDistrictId) return;
 
    this.policeStationService.getByDistrictId(this.selectedDistrictId)
      .subscribe(res => {
        this.policeStations = res;
        this.cdr.markForCheck();
      });
  }
 
  // =========================
  // ZONE ASSIGNMENT
  // =========================
 
  get canAddZone(): boolean {
    return !!this.selectedCountryId &&
      !!this.selectedDivisionId &&
      !!this.selectedDistrictId &&
      !!this.selectedPoliceStationId;
  }
 
  addZone(): void {
    if (!this.canAddZone) return;
 
    const alreadyAdded = this.rider.zones.some(
      z => z.policeStationId === this.selectedPoliceStationId
    );
 
    if (alreadyAdded) {
      alert('This zone has already been added.');
      return;
    }
 
    const country = this.countries.find(c => c.id === this.selectedCountryId);
    const division = this.divisions.find(d => d.id === this.selectedDivisionId);
    const district = this.districts.find(d => d.id === this.selectedDistrictId);
    const policeStation = this.policeStations.find(p => p.id === this.selectedPoliceStationId);
 
    if (!country || !division || !district || !policeStation) return;
 
    // NOTE: adjust property names below (e.g. division.nameBn, policeStation.postalCode)
    // to match whatever your actual division/policeStation API responses return.
    const zone: ZoneSummary = {
      policeStationId: policeStation.id,
      name: policeStation.name,
      postalCode: policeStation.postalCode || '',
      districtId: district.id,
      districtName: district.name,
      divisionId: division.id,
      divisionName: division.name,
      divisionNameBn: division.nameBn || '',
      countryId: country.id,
      countryName: country.name
    };
 
    this.rider.zones.push(zone);
 
    // Only reset the police station so it's easy to add another
    // zone in the same district right away.
    this.selectedPoliceStationId = null;
  }
 
  removeZone(zone: ZoneSummary): void {
    this.rider.zones = this.rider.zones.filter(
      z => z.policeStationId !== zone.policeStationId
    );
  }
 
  // =========================
  // PHOTO
  // =========================
 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
 
    this.selectedFile = file;
 
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }
 
  removeSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreview = null;
    fileInput.value = '';
  }
 
  // =========================
  // PASSWORD
  // =========================
 
  get passwordsMismatch(): boolean {
    return !!this.confirmPassword && this.rider.password !== this.confirmPassword;
  }
 
  // =========================
  // SUBMIT
  // =========================
 
  saveRider(): void {
    this.submitted = true;
 
    if (this.passwordsMismatch) {
      return;
    }
 
    if (this.rider.zones.length === 0) {
      return;
    }
 
    this.riderService.create(this.rider, this.selectedFile || undefined).subscribe({
      next: () => {
        alert('Rider Saved Successfully');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save rider.');
      }
    });
  }
 
  private resetForm(): void {
    this.rider = {
      name: '',
      email: '',
      phone: '',
      password: '',
      vehicleType: '',
      vehicleNumber: '',
      nidNumber: '',
      zones: []
    };
 
    this.confirmPassword = '';
    this.submitted = false;
 
    this.selectedFile = null;
    this.imagePreview = null;
 
    this.selectedCountryId = null;
    this.selectedDivisionId = null;
    this.selectedDistrictId = null;
    this.selectedPoliceStationId = null;
 
    this.divisions = [];
    this.districts = [];
    this.policeStations = [];
  }


}
