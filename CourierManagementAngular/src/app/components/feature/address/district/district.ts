import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DivisionModel } from '../../../../models/division.model';
import { DistrictModel } from '../../../../models/district.model';
import { DivisionService } from '../../../../services/division.service';
import { DistrictService } from '../../../../services/district.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-district',
  imports: [CommonModule, FormsModule],
  templateUrl: './district.html',
  styleUrl: './district.css',
})
export class District implements OnInit {




  district: DistrictModel = {
    name: '',
    nameBn: '',
    active: true,
    districtCode: '',
    division: {
      id: null as any
    }
  };

  isEdit = false;

  ngOnInit(): void {
    this.loadDistrict();
    this.loadDivision();
  }

  divisions: DivisionModel[] = [];
  districts: DistrictModel[] = [];



  constructor(
    private divisionService: DivisionService,
    private districtService: DistrictService,
    private cdr: ChangeDetectorRef
  ) { }



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



  loadDistrict() {
    this.districtService.getAll().subscribe(
      {
        next: (data) => {

          this.districts = data;
          this.cdr.markForCheck();
          console.log(data);
        },
        error: (err) => {
          console.log(err);

        }
      }
    );
  }


  saveDistrict(): void {

    if (this.isEdit && this.district.id) {

      this.districtService
        .update(this.district.id, this.district)
        .subscribe({
          next: () => {
            this.loadDistrict();
            this.resetForm();
          }
        });

    } else {

      this.districtService
        .save(this.district)
        .subscribe({
          next: () => {
            this.loadDistrict();
            this.resetForm();
          }
        });
    }
  }




  // Load Data to Form when Click Edit Button
  editDistrict(item: DistrictModel): void {

    this.district = {
      id: item.id,
      name: item.name,
      nameBn: item.nameBn,
      active: item.active,
      districtCode: item.districtCode,
      division: {
        id: item.division.id
      }
    };

    this.isEdit = true;
  }



  deleteDistrict(id: number | undefined): void {

    if (!id) return;

    if (confirm('Delete this District?')) {

      this.districtService.delete(id)
        .subscribe({
          next: () => {
            this.loadDistrict();
          }
        });
    }
  }



  resetForm(): void {

    this.district = {
      name: '',
      nameBn: '',
      active: true,
      districtCode: '',
      division: {
        id: 0
      }
    };

    this.isEdit = false;
  }

}


