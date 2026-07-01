import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerModel, CustomerResponseModel } from '../../../../models/customer.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { DistrictService } from '../../../../services/district.service';
import { DivisionService } from '../../../../services/division.service';
import { CountryService } from '../../../../services/country.service';
import { CustomerService } from '../../../../services/customer.service';
import { LoginResponse } from '../../../../models/auth.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-profile-component',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-profile-component.html',
  styleUrl: './customer-profile-component.css',
})
export class CustomerProfileComponent {


   user: LoginResponse | null = null;
  customer: CustomerResponseModel | null = null;
 
  // ── Form fields ───────────────────────────────────────────────
  form: CustomerModel = {
    name: '', email: '', phone: '', password: '',
    address: '', gender: '', dob: '', policeStationId: 0
  };
 
  streetAddress = '';
 
  // ── Location cascade ──────────────────────────────────────────
  countries: any[] = [];
  divisions: any[] = [];
  districts: any[] = [];
  policeStations: any[] = [];
  selectedCountryId: number | null = null;
  selectedDivisionId: number | null = null;
  selectedDistrictId: number | null = null;
 
  // ── Photo ─────────────────────────────────────────────────────
  imageBase = environment.imgUrl + 'customer/';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
 
  // ── Password (optional change) ────────────────────────────────
  showPasswordSection = false;
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
 
  // ── UI state ───────────────────────────────────────────────────
  loading = true;
  saving = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
 
  constructor(
    private customerService: CustomerService,
    private storage: StorageService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private psService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.countryService.getAll().subscribe(data => { this.countries = data; });
    this.loadCustomer();
  }
 
  loadCustomer(): void {
    this.loading = true;
 
    const cached = this.storage.getData<CustomerResponseModel>(KEYS.CUSTOMER);
    if (cached) {
      this.applyCustomer(cached);
      this.loading = false;
    }
 
    if (this.user?.userId) {
      this.customerService.findByUserId(this.user.userId).subscribe({
        next: (res) => {
          this.applyCustomer(res);
          this.storage.saveData(KEYS.CUSTOMER, res);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; }
      });
    }
  }
 
  private applyCustomer(c: CustomerResponseModel): void {
    this.customer = c;
    this.form.name            = c.name        ?? this.user?.name  ?? '';
    this.form.email           = c.email        ?? this.user?.email ?? '';
    this.form.phone           = c.phone        ?? this.user?.phone ?? '';
    this.form.gender          = (c as any).gender ?? '';
    this.form.dob             = (c as any).dob     ?? '';
    this.form.policeStationId = (c as any).policeStationId ?? 0;
 
    // Existing address is the combined string (street + location names).
    // Keep it as the readonly "full address" until the user regenerates it
    // by re-picking the location, same pattern as the original add form.
    this.form.address = (c as any).address ?? '';
    this.streetAddress = '';
  }
 
  // ── Photo handling ────────────────────────────────────────────
 
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview = reader.result; };
    reader.readAsDataURL(file);
  }
 
  removeSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreview = null;
    fileInput.value = '';
  }
 
  get currentPhotoUrl(): string | null {
    if (this.imagePreview) return this.imagePreview as string;
    if ((this.customer as any)?.image) return this.imageBase + (this.customer as any).image;
    return null;
  }
 
  // ── Location cascade (only used if customer wants to update address) ──
 
  onCountryChange(): void {
    this.divisions = []; this.districts = []; this.policeStations = [];
    this.selectedDivisionId = null; this.selectedDistrictId = null;
    if (!this.selectedCountryId) return;
    this.divisionService.getByCountryId(this.selectedCountryId).subscribe(r => {
      this.divisions = r; this.cdr.markForCheck();
    });
  }
 
  onDivisionChange(): void {
    this.districts = []; this.policeStations = [];
    this.selectedDistrictId = null;
    if (!this.selectedDivisionId) return;
    this.districtService.getByDivisionId(this.selectedDivisionId).subscribe(r => {
      this.districts = r; this.cdr.markForCheck();
    });
  }
 
  onDistrictChange(): void {
    this.policeStations = [];
    if (!this.selectedDistrictId) return;
    this.psService.getByDistrictId(this.selectedDistrictId).subscribe(r => {
      this.policeStations = r; this.cdr.markForCheck();
    });
  }
 
  generateAddress(): void {
    const country  = this.countries.find(c => c.id === this.selectedCountryId)?.name || '';
    const division = this.divisions.find(d => d.id === this.selectedDivisionId)?.name || '';
    const district = this.districts.find(d => d.id === this.selectedDistrictId)?.name || '';
    const station  = this.policeStations.find(p => p.id === this.form.policeStationId)?.name || '';
 
    this.form.address = [this.streetAddress, station, district, division, country]
      .filter(v => v)
      .join(', ');
  }
 
  // ── Password ──────────────────────────────────────────────────
 
  get passwordsMismatch(): boolean {
    return !!this.newPassword && this.newPassword !== this.confirmPassword;
  }
 
  // ── Save ──────────────────────────────────────────────────────
 
  saveProfile(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;
 
    if (!this.form.name || !this.form.email || !this.form.phone) return;
    if (this.showPasswordSection && this.newPassword && this.passwordsMismatch) return;
 
    if (!this.customer?.id) {
      this.errorMessage = 'Profile not loaded yet. Please try again.';
      return;
    }
 
    this.saving = true;
 
    const payload: CustomerModel = { ...this.form };
 
    if (this.showPasswordSection && this.newPassword) {
      payload.password = this.newPassword;
    } else {
      delete (payload as any).password; // don't overwrite password if not changing it
    }
 
    this.customerService.update(this.customer.id, payload, this.selectedFile).subscribe({
      next: (updated) => {
        this.customer = updated;
        this.applyCustomer(updated);
        this.storage.saveData(KEYS.CUSTOMER, updated);
 
        if (this.user) {
          this.user.name  = updated.name  ?? this.user.name;
          this.user.email = updated.email ?? this.user.email;
          this.user.phone = updated.phone ?? this.user.phone;
          this.storage.saveData(KEYS.USER, this.user);
        }
 
        this.selectedFile = null;
        this.imagePreview = null;
        this.newPassword = '';
        this.confirmPassword = '';
        this.showPasswordSection = false;
        this.submitted = false;
 
        this.successMessage = 'Profile updated successfully.';
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to update profile. Please try again.';
        this.saving = false;
      }
    });
  }


}
