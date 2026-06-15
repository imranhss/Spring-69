import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CountryModel } from '../../../../models/country';
import { CountryService } from '../../../../services/country.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-country',
  imports: [CommonModule, FormsModule],
  templateUrl: './country.html',
  styleUrl: './country.css',
})
export class Country implements OnInit{

  countries: CountryModel[] = [];


  country: CountryModel = {

    name: '',
    code: '',
    phoneCode: '',
    active: true

  };



  isEdit = false;



  constructor(
    private service: CountryService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit() {

    this.loadCountries();

  }




  loadCountries() {

    this.service.getAll()
      .subscribe(data => {

        this.countries = data;
        this.cdr.markForCheck();
        console.log(data)

      });

  }




  save() {


    if (this.isEdit) {


      this.service.update(
        this.country.id!,
        this.country
      )
        .subscribe(() => {

          alert("Updated Successfully");

          this.reset();

          this.loadCountries();


        });



    }
    else {


      this.service.save(this.country)
        .subscribe(() => {

          alert("Saved Successfully");

          this.reset();

          this.loadCountries();

        });


    }


  }





  edit(c: CountryModel) {


    this.country = { ...c };

    this.isEdit = true;


  }





  delete(id: number) {


    if (confirm("Delete this country?")) {


      this.service.delete(id)
        .subscribe(() => {


          alert("Deleted");

          this.loadCountries();


        });


    }


  }





  reset() {


    this.country = {

      name: '',
      code: '',
      phoneCode: '',
      active: true

    };


    this.isEdit = false;


  }
}
