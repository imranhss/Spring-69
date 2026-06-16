import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CountryService } from '../../../../services/country.service';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { PolicestationService } from '../../../../services/policestation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location-searchcomponent',
  imports: [CommonModule, FormsModule],
  templateUrl: './location-searchcomponent.html',
  styleUrl: './location-searchcomponent.css',
})
export class LocationSearchcomponent implements OnInit{


 countries: any[] = [];
  divisions: any[] = [];
  districts: any[] = [];
  stations: any[] = [];

  selectedCountryId: number | null = null;
  selectedDivisionId: number | null = null;
  selectedDistrictId: number | null = null;

  keyword: string = '';

  constructor(
    private countryService: CountryService,
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private stationService: PolicestationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {

    this.countryService.getAll()
      .subscribe(data => {

        this.countries = data;
        this.cdr.markForCheck();
        console.log(data)

      });

  }



  onCountryChange() {

    this.divisions = [];
    this.districts = [];
    this.stations = [];

    this.selectedDivisionId = null;
    this.selectedDistrictId = null;

    if (!this.selectedCountryId) return;

    this.divisionService.getByCountryId(this.selectedCountryId)
      .subscribe(res => {
        this.divisions = res;
        this.cdr.markForCheck();
      });
  }

  onDivisionChange() {

    this.districts = [];
    this.stations = [];

    this.selectedDistrictId = null;

    if (!this.selectedDivisionId) return;

    this.districtService.getByDivisionId(this.selectedDivisionId)
      .subscribe(res => {
        this.districts = res;
        this.cdr.markForCheck();
      });
  }

  onDistrictChange() {

    this.stations = [];

    if (!this.selectedDistrictId) return;

    this.stationService.getByDistrictId(this.selectedDistrictId)
      .subscribe(res => {
        this.stations = res;
        this.cdr.markForCheck();
      });
  }

  // ⭐ NEW SMART SEARCH
  search() {

    if (this.keyword.trim().length === 0) {
      this.stations = [];
      return;
    }

    this.stationService.search(this.keyword)
      .subscribe(res => {
        this.stations = res;
      });
  }

}
