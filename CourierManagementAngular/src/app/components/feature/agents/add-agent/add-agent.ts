import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AgentService } from '../../../../services/agent.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';

@Component({
  selector: 'app-add-agent',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-agent.html',
  styleUrl: './add-agent.css',
})
export class AddAgent {

  @ViewChild('agentForm') agentForm!: NgForm;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  // =========================
  // LOCATION DROPDOWN DATA
  // =========================

  /** List of available countries */
  countries: any[] = [];

  /** List of divisions based on selected country */
  divisions: any[] = [];

  /** List of districts based on selected division */
  districts: any[] = [];



  // =========================
  // SELECTED LOCATION IDS
  // =========================

  /** Selected Country ID */
  selectedCountryId: number | null = null;

  /** Selected Division ID */
  selectedDivisionId: number | null = null;

  /** Selected District ID */
  selectedDistrictId: number | null = null;




  agent: any = {
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: '',
    hubId: null
  };

  policeStations: any[] = [];

  selectedFile: File | null = null;
  imagePreview: any = null;

  // Password UI state
  confirmPassword: string = '';
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  constructor(
    private agentService: AgentService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private policeStationService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }

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


  loadPoliceStations(): void {
    this.policeStationService.getAll().subscribe({
      next: (res) => {
        this.policeStations = res;
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.markForCheck();
      };

      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreview = null;
    fileInput.value = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordsMismatch(): boolean {
    return !!this.confirmPassword && this.agent.password !== this.confirmPassword;
  }

  saveAgent(): void {

    this.submitted = true;

    if (this.passwordsMismatch) {
      // Stop here — template shows "Passwords do not match" inline
      return;
    }

    this.agentService
      .createAgent(this.agent, this.selectedFile!)
      .subscribe({
        next: (res) => {
          alert('Agent Saved Successfully');
          this.resetForm();

          this.agent = {
            name: '',
            email: '',
            phone: '',
            password: '',
            designation: '',
            hubId: null
          };

          this.confirmPassword = '';
          this.submitted = false;

          this.selectedFile = null;
          this.imagePreview = null;

          this.selectedCountryId = null;
          this.selectedDivisionId = null;
          this.selectedDistrictId = null;
          this.divisions = [];
          this.districts = [];
          this.policeStations = [];
        },
        error: (err) => {
          console.error(err);
        }
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

    this.policeStationService.getByDistrictId(this.selectedDistrictId)
      .subscribe(res => {

        this.policeStations = res;

        this.cdr.markForCheck();
      });
  }


   /**
   * Resets the agent form completely:
   * - clears the model
   * - clears location dropdown state
   * - clears the selected photo + preview
   * - resets Angular form state (touched/dirty/submitted/validation classes)
   */
  resetForm(): void {
    this.agent = {
      name: '',
      email: '',
      phone: '',
      password: '',
      designation: '',
      hubId: null
    };

    this.confirmPassword = '';
    this.submitted = false;

    this.selectedFile = null;
    this.imagePreview = null;

    this.selectedCountryId = null;
    this.selectedDivisionId = null;
    this.selectedDistrictId = null;
    this.divisions = [];
    this.districts = [];
    this.policeStations = [];

    // Reset native file input (ngModel won't touch this one)
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }

    // Reset Angular's form state: clears touched/dirty/ngSubmitted
    // and removes validation CSS classes from the template
    if (this.agentForm) {
      this.agentForm.resetForm();
    }

    this.cdr.markForCheck();
  }

}
