import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../services/customer.service';
import { CustomerModel } from '../../../../models/customer.model';

@Component({
  selector: 'app-customerdashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './customerdashboard.html',
  styleUrl: './customerdashboard.css',
})
export class Customerdashboard implements OnInit {


  user: LoginResponse | null = null;
  userId!: number;
  customer!: CustomerModel;
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

    console.log(this.user + "3333333333333333333")
  }

  loadCustomer() {

    this.customerService.findByUserId(this.userId).subscribe(

      {
        next: res=>{
          this.customer = res;
          this.cdr.markForCheck();
          console.log(res);
        },
        error: err=>{
          console.log(err);
        }
      }

    );

  }


  logout(): void { this.auth.logout(); }

}
