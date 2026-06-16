import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DivisionService } from '../../../../services/division.service';
import { CountryService } from '../../../../services/country.service';
import { CountryModel } from '../../../../models/country';
import { DivisionModel } from '../../../../models/division.model';

@Component({
  selector: 'app-division',
  imports: [CommonModule, FormsModule],
  templateUrl: './division.html',
  styleUrl: './division.css',
})
export class Division implements OnInit {

  countries: CountryModel[] = [];
  divisions: DivisionModel[] = [];


  division: DivisionModel = {
    name: '',
    nameBn: '',
    active: true,
    country: {
      id: 0
    }
  };

  isEdit = false;


  constructor(
    private divisionService: DivisionService,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.loadCountries();
    this.loadDivision();
  }

  loadCountries() {
    this.countryService.getAll().subscribe(
      {
        next: (data) => {

          this.countries = data;
          this.cdr.markForCheck();
          console.log(data);
        },
        error: (err) => {
          console.log(err);
          
        }
      }
    );
  }
  loadDivision() {
    this.divisionService.getAll().subscribe(
      {
        next: (data) => {

          this.divisions = data;
          this.cdr.markForCheck();
          console.log(data);
        },
        error: (err) => {
          console.log(err);

        }
      }
    );
  }


  saveDivision(): void {

    if (this.isEdit && this.division.id) {

      this.divisionService
        .update(this.division.id, this.division)
        .subscribe({
          next: () => {
            this.loadDivision();
            this.resetForm();
          }
        });

    } else {

      this.divisionService
        .save(this.division)
        .subscribe({
          next: () => {
            this.loadDivision();
            this.resetForm();
          }
        });
    }
  }

  // Load Data to Form when Click Edit Button
    editDivision(item: DivisionModel): void {

    this.division = {
      id: item.id,
      name: item.name,
      nameBn: item.nameBn,
      active: item.active,
      country: {
        id: item.country.id
      }
    };

    this.isEdit = true;
  }



  deleteDivision(id: number | undefined): void {

    if (!id) return;

    if (confirm('Delete this division?')) {

      this.divisionService.delete(id)
        .subscribe({
          next: () => {
            this.loadDivision();
          }
        });
    }
  }



    resetForm(): void {

    this.division = {
      name: '',
      nameBn: '',
      active: true,
      country: {
        id: 0
      }
    };

    this.isEdit = false;
  }




}
