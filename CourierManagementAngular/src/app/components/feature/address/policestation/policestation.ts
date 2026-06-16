import { ChangeDetectorRef, Component } from '@angular/core';
import { PolicestationService } from '../../../../services/policestation.service';
import { DistrictService } from '../../../../services/district.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-policestation',
  imports: [CommonModule, FormsModule],
  templateUrl: './policestation.html',
  styleUrl: './policestation.css',
})
export class Policestation {


  stations: any[] = [];
  districts: any[] = [];

  station: any = {
    id: null,
    name: '',
    nameBn: '',
    postalCode: '',
    active: true,
    district: {
      id: 0
    }
  };

  isEdit = false;

  constructor(
    private stationService: PolicestationService,
    private districtService: DistrictService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadStations();
    this.loadDistricts();
  }

  loadStations() {
    this.stationService.getAll().subscribe({
      next: (res) => {
        this.stations = res;
        this.cdr.markForCheck();

      },


    });
  }

  loadDistricts() {
    this.districtService.getAll().subscribe({
      next: (res) => {
        this.districts = res;
        this.cdr.markForCheck();
      }
    });
  }

  save() {

    if (this.isEdit && this.station.id) {

      this.stationService.update(this.station.id, this.station)
        .subscribe(() => {
          this.loadStations();
          this.reset();
        });

    } else {

      this.stationService.save(this.station)
        .subscribe(() => {
          this.loadStations();
          this.reset();
        });
    }
  }

  edit(item: any) {

    this.station = {
      id: item.id,
      name: item.name,
      nameBn: item.nameBn,
      postalCode: item.postalCode,
      active: item.active,
      district: {
        id: item.district.id
      }
    };

    this.isEdit = true;
  }

  delete(id: number) {

    if (confirm('Delete this Police Station?')) {

      this.stationService.delete(id).subscribe(() => {
        this.loadStations();
      });

    }
  }

  reset() {

    this.station = {
      id: null,
      name: '',
      nameBn: '',
      postalCode: '',
      active: true,
      district: {
        id: 0
      }
    };

    this.isEdit = false;
  }

}
