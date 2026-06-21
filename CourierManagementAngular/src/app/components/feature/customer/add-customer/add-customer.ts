import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerModel } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer.service';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer implements OnInit {

  // =========================
  // LOCATION DROPDOWN DATA
  // =========================

  /** List of available countries */
  countries: any[] = [];

  /** List of divisions based on selected country */
  divisions: any[] = [];

  /** List of districts based on selected division */
  districts: any[] = [];

  /** List of police stations based on selected district */
  policeStations: any[] = [];

  // =========================
  // SELECTED LOCATION IDS
  // =========================

  /** Selected Country ID */
  selectedCountryId: number | null = null;

  /** Selected Division ID */
  selectedDivisionId: number | null = null;

  /** Selected District ID */
  selectedDistrictId: number | null = null;

  // =========================
  // FILE UPLOAD
  // =========================

  /** Customer profile image */
  selectedFile: File | null = null;

  // =========================
  // ADDRESS
  // =========================

  /**
   * User enters House/Road/Village information here.
   * Final address will be generated automatically by combining:
   *
   * House/Road + Police Station + District + Division + Country
   */
  streetAddress: string = '';

  // =========================
  // PASSWORD UI
  // =========================

  /** Confirm password input value */
  confirmPassword: string = '';

  /** Toggle Password visibility */
  showPassword = false;

  /** Toggle Confirm Password visibility */
  showConfirmPassword = false;

  /** Indicates form submission attempt */
  submitted = false;

  // =========================
  // CUSTOMER MODEL
  // =========================

  customer: CustomerModel = {
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    gender: '',
    dob: '',
    policeStationId: 0
  };

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private stationService: PolicestationService
  ) {}

  /**
   * Component initialization
   * Loads all countries when page opens.
   */
  ngOnInit(): void {
    this.loadCountries();
  }

  // =====================================================
  // LOAD COUNTRY LIST
  // =====================================================

  /**
   * Fetch all countries from backend API.
   */
  loadCountries() {
    this.countryService.getAll()
      .subscribe(data => {

        this.countries = data;

        // Force UI refresh if needed
        this.cdr.markForCheck();

        console.log('Countries Loaded:', data);
      });
  }

  // =====================================================
  // COUNTRY CHANGED
  // =====================================================

  /**
   * Triggered when user selects a country.
   *
   * Clears:
   * - Divisions
   * - Districts
   * - Police Stations
   *
   * Then loads divisions for selected country.
   */
  onCountryChange() {

    this.divisions = [];
    this.districts = [];
    this.policeStations = [];

    this.selectedDivisionId = null;
    this.selectedDistrictId = null;

    if (!this.selectedCountryId) return;

    this.divisionService.getByCountryId(this.selectedCountryId)
      .subscribe(res => {

        this.divisions = res;

        this.cdr.markForCheck();
      });
  }

  // =====================================================
  // DIVISION CHANGED
  // =====================================================

  /**
   * Triggered when user selects a division.
   *
   * Clears:
   * - Districts
   * - Police Stations
   *
   * Then loads districts for selected division.
   */
  onDivisionChange() {

    this.districts = [];
    this.policeStations = [];

    this.selectedDistrictId = null;

    if (!this.selectedDivisionId) return;

    this.districtService.getByDivisionId(this.selectedDivisionId)
      .subscribe(res => {

        this.districts = res;

        this.cdr.markForCheck();
      });
  }

  // =====================================================
  // DISTRICT CHANGED
  // =====================================================

  /**
   * Triggered when user selects a district.
   *
   * Clears current police station list and
   * loads police stations for selected district.
   */
  onDistrictChange() {

    this.policeStations = [];

    if (!this.selectedDistrictId) return;

    this.stationService.getByDistrictId(this.selectedDistrictId)
      .subscribe(res => {

        this.policeStations = res;

        this.cdr.markForCheck();
      });
  }

  // =====================================================
  // FILE SELECTION
  // =====================================================

  /**
   * Captures selected image file from file input.
   */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  /**
   * Show/Hide Password field.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Show/Hide Confirm Password field.
   */
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // =====================================================
  // PASSWORD VALIDATION
  // =====================================================

  /**
   * Returns true when password and confirm password
   * are different.
   */
  get passwordsMismatch(): boolean {
    return !!this.confirmPassword &&
           this.customer.password !== this.confirmPassword;
  }

  // =====================================================
  // CUSTOMER REGISTRATION
  // =====================================================

  /**
   * Register a new customer.
   *
   * Steps:
   * 1. Validate passwords
   * 2. Generate full address
   * 3. Send customer + image to backend
   */
  register() {

    this.submitted = true;

    // Password validation
    if (this.passwordsMismatch) {
      return;
    }

    // Generate full address before save
    this.generateSenderAddress();

    this.customerService.create(
      this.customer,
      this.selectedFile
    ).subscribe({

      next: () => {
        alert('Registration Successful');
      },

      error: err => {
        console.log(err);
      }
    });
  }

  // =====================================================
  // ADDRESS GENERATOR
  // =====================================================

  /**
   * Creates a complete address string:
   *
   * Example:
   * House #10, Road #5,
   * Dhanmondi,
   * Dhaka,
   * Dhaka,
   * Bangladesh
   *
   * Stored in customer.address
   */
  generateSenderAddress() {

    console.log("Selected IDs:", {
      country: this.selectedCountryId,
      division: this.selectedDivisionId,
      district: this.selectedDistrictId,
      police: this.customer.policeStationId
    });

    const country =
      this.countries.find(x => x.id == this.selectedCountryId)?.name || '';

    const division =
      this.divisions.find(x => x.id == this.selectedDivisionId)?.name || '';

    const district =
      this.districts.find(x => x.id == this.selectedDistrictId)?.name || '';

    const policeStation =
      this.policeStations.find(
        x => x.id == this.customer.policeStationId
      )?.name || '';

    // Build final address
    this.customer.address =
      [
        this.streetAddress,
        policeStation,
        district,
        division,
        country
      ]
      .filter(v => v)
      .join(', ');

    console.log('Generated Address:', this.customer.address);
  }
}