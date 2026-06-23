import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../services/customer.service';
import { CustomerModel, CustomerResponseModel } from '../../../../models/customer.model';
import { KEYS } from '../../../../services/storage.service';

@Component({
  selector: 'app-customerdashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './customerdashboard.html',
  styleUrl: './customerdashboard.css',
})
export class Customerdashboard implements OnInit {


  user: LoginResponse | null = null;
  userId!: number;
  customer: CustomerResponseModel | null = null;
 imageUrl = 'http://localhost:8085/images/customer/';


  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();


    if (this.user?.userId) {
      this.userId = this.user?.userId;

    }
    this.loadCustomer();

    const customer = this.storage.getData<CustomerModel>(KEYS.CUSTOMER);
    console.log(customer);
  }

  loadCustomer() {

    this.customerService.findByUserId(this.userId).subscribe(

      {
        next: res=>{
          this.customer = res;
          this.cdr.markForCheck();
          
          this.storage.saveData(KEYS.CUSTOMER, res);

        },
        error: err=>{
          console.log(err);
        }
      }

    );

  }


  logout(): void { this.auth.logout();
    this.storage.removeData(KEYS.CUSTOMER);
   }

}
