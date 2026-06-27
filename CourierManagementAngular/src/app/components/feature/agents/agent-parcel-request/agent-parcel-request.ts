import { ChangeDetectorRef, Component } from '@angular/core';
import { AgentService } from '../../../../services/agent.service';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { AgentParcelRequest } from '../../../../models/agentParcelrequest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentResponseModel } from '../../../../models/agent.model';
import { BookingReceiptComponent } from '../../print/booking-receipt-component/booking-receipt-component';



@Component({
  selector: 'app-agent-parcel-request',
  imports: [CommonModule, FormsModule, BookingReceiptComponent],
  templateUrl: './agent-parcel-request.html',
  styleUrl: './agent-parcel-request.css',
})
export class AgentParcelRequestComponent {

  agent: AgentResponseModel | null = null;

   parcel: AgentParcelRequest = {
    agentId: 0,
    senderName: '', senderPhone: '', senderAddress: '',
    originPoliceStationId: null,  // null = use agent's own hub
    receiverName: '', receiverPhone: '', receiverAddress: '',
    destinationPoliceStationId: 0,
    parcelType: '', weight: 0, description: '', specialInstructions: '',
    serviceType: '', priority: 'NORMAL',
    paymentMethod: '', codAmount: 0,
  };
 
  // ── Origin location cascade ───────────────────────────────────
  oCountries: any[] = []; oDivisions: any[] = [];
  oDistricts: any[] = []; oStations:  any[] = [];
  oCountryId:  number | null = null;
  oDivisionId: number | null = null;
  oDistrictId: number | null = null;
 
  // ── Destination location cascade ──────────────────────────────
  dCountries: any[] = []; dDivisions: any[] = [];
  dDistricts: any[] = []; dStations:  any[] = [];
  dCountryId:  number | null = null;
  dDivisionId: number | null = null;
  dDistrictId: number | null = null;
 
  // ── Price preview ─────────────────────────────────────────────
  estimatedCharge: number | null = null;
  calculatingPrice = false;
 
  // ── UI state ──────────────────────────────────────────────────
  submitted = false;
  submitting = false;
  successParcel: any = null;
  errorMessage: string | null = null;
 
  readonly parcelTypes    = ['DOCUMENT', 'PRODUCT', 'FRAGILE', 'HEAVY', 'PERISHABLE'];
  readonly serviceTypes   = ['STANDARD', 'EXPRESS', 'SAME_DAY', 'OVERNIGHT'];
  readonly priorities     = ['NORMAL', 'HIGH', 'URGENT'];
  readonly paymentMethods = ['BKASH', 'NAGAD', 'COD', 'SSLCOMMERZ', 'PREPAID'];
 
  constructor(
    private agentService: AgentService,
    private storage: StorageService,
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private psService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) { }
 

  ngOnInit(): void {
    const user = this.storage.getUser();


    const agent = this.storage.getData<AgentResponseModel>(KEYS.AGENT);

    this.parcel.agentId = agent?.id ?? 0;

    this.countryService.getAll().subscribe(data => {
      this.oCountries = data;
      this.dCountries = data;
      this.cdr.markForCheck();
    });
  }

  // ── Origin cascade ────────────────────────────────────────────

  onOCountryChange(): void {
    this.oDivisions = []; this.oDistricts = []; this.oStations = [];
    this.oDivisionId = null; this.oDistrictId = null;
    this.parcel.originPoliceStationId = 0;
    if (!this.oCountryId) return;
    this.divisionService.getByCountryId(this.oCountryId).subscribe(r => {
      this.oDivisions = r; this.cdr.markForCheck();
    });
  }

  onODivisionChange(): void {
    this.oDistricts = []; this.oStations = [];
    this.oDistrictId = null; this.parcel.originPoliceStationId = 0;
    if (!this.oDivisionId) return;
    this.districtService.getByDivisionId(this.oDivisionId).subscribe(r => {
      this.oDistricts = r; this.cdr.markForCheck();
    });
  }

  onODistrictChange(): void {
    this.oStations = []; this.parcel.originPoliceStationId = 0;
    if (!this.oDistrictId) return;
    this.psService.getByDistrictId(this.oDistrictId).subscribe(r => {
      this.oStations = r; this.cdr.markForCheck();
    });
  }

  // ── Destination cascade ───────────────────────────────────────

  onDCountryChange(): void {
    this.dDivisions = []; this.dDistricts = []; this.dStations = [];
    this.dDivisionId = null; this.dDistrictId = null;
    this.parcel.destinationPoliceStationId = 0;
    if (!this.dCountryId) return;
    this.divisionService.getByCountryId(this.dCountryId).subscribe(r => {
      this.dDivisions = r; this.cdr.markForCheck();
    });
  }

  onDDivisionChange(): void {
    this.dDistricts = []; this.dStations = [];
    this.dDistrictId = null; this.parcel.destinationPoliceStationId = 0;
    if (!this.dDivisionId) return;
    this.districtService.getByDivisionId(this.dDivisionId).subscribe(r => {
      this.dDistricts = r; this.cdr.markForCheck();
    });
  }

  onDDistrictChange(): void {
    this.dStations = []; this.parcel.destinationPoliceStationId = 0;
    if (!this.dDistrictId) return;
    this.psService.getByDistrictId(this.dDistrictId).subscribe(r => {
      this.dStations = r; this.cdr.markForCheck();
    });
  }

  // ── Live price preview ────────────────────────────────────────

  recalcPrice(): void {
    if (!this.parcel.weight || !this.parcel.serviceType) {
      this.estimatedCharge = null;
      return;
    }
    this.calculatingPrice = true;
    this.agentService
      .calculateCharge(this.parcel.weight, this.parcel.serviceType, this.parcel.codAmount)
      .subscribe({
        next: (charge) => {
          this.estimatedCharge = charge;
          this.calculatingPrice = false;
          this.cdr.markForCheck();
        },
        error: () => { this.calculatingPrice = false; }
      });
  }

  // ── Validation ────────────────────────────────────────────────

  get isFormValid(): boolean {
    return !!(
      this.parcel.senderName && this.parcel.senderPhone &&
      this.parcel.receiverName && this.parcel.receiverPhone &&
      this.parcel.destinationPoliceStationId &&
      this.parcel.parcelType && this.parcel.weight &&
      this.parcel.serviceType && this.parcel.paymentMethod
    );
  }

  // ── Submit ────────────────────────────────────────────────────

  // bookParcel(): void {
  //   this.submitted = true;
  //   this.errorMessage = null;
  //   if (!this.isFormValid) return;

  //   this.submitting = true;

  //   this.agentService.bookParcel(this.parcel).subscribe({
  //     next: (res) => {
  //       this.successParcel = res;
  //       this.submitting = false;
  //       this.cdr.markForCheck();
  //     },
  //     error: (err) => {
  //       this.errorMessage = err?.error?.message ?? 'Booking failed. Please try again.';
  //       this.submitting = false;
  //     }
  //   });
  // }


   // ── Submit ────────────────────────────────────────────────────
 
  bookParcel(): void {
    this.submitted = true;
    this.errorMessage = null;
    if (!this.isFormValid) return;
 
    this.submitting = true;
 
    this.agentService.bookParcel(this.parcel).subscribe({
      next: (res) => {
        this.successParcel = res;
        this.submitting = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Booking failed. Please try again.';
        this.submitting = false;
      }
    });
  }
 
  bookAnother(): void {
    this.successParcel = null;
    this.submitted = false;
    this.estimatedCharge = null;
    this.errorMessage = null;
 
    const agentId = this.parcel.agentId;
    this.parcel = {
      agentId,
      senderName: '', senderPhone: '', senderAddress: '',
      originPoliceStationId: null,
      receiverName: '', receiverPhone: '', receiverAddress: '',
      destinationPoliceStationId: 0,
      parcelType: '', weight: 0, description: '', specialInstructions: '',
      serviceType: '', priority: 'NORMAL', paymentMethod: '', codAmount: 0,
    };
 
    // Reset location selects
    this.oCountryId = null; this.oDivisionId = null; this.oDistrictId = null;
    this.oDivisions = []; this.oDistricts = []; this.oStations = [];
    this.dCountryId = null; this.dDivisionId = null; this.dDistrictId = null;
    this.dDivisions = []; this.dDistricts = []; this.dStations = [];
  }


}
