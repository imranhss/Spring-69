import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../services/customer.service';
import { CustomerModel, CustomerResponseModel } from '../../../../models/customer.model';
import { KEYS } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import { ParcelService } from '../../../../services/parcel.service';
import { RouterModule } from '@angular/router';
import { PARCEL_STATUS_META, ParcelResponse, ParcelStatus } from '../../../../models/parcel.model';

@Component({
  selector: 'app-customerdashboard',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './customerdashboard.html',
  styleUrl: './customerdashboard.css',
})
export class Customerdashboard implements OnInit {


  user: LoginResponse | null = null;
  userId!: number;
  customer: CustomerResponseModel | null = null;
  imageUrl = environment.imgUrl + 'customer/';
 
  stats = { total: 0, inTransit: 0, delivered: 0, pending: 0 };
  recentParcels: ParcelResponse[] = [];
 
  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private customerService: CustomerService,
    private parcelService: ParcelService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.user = this.storage.getUser();
 
    if (this.user?.userId) {
      this.userId = this.user.userId;
    }
 
    this.loadCustomer();
  }
 
  loadCustomer(): void {
    this.customerService.findByUserId(this.userId).subscribe({
      next: (res) => {
        this.customer = res;
        this.storage.saveData(KEYS.CUSTOMER, res);
        this.cdr.markForCheck();
 
        if (this.customer?.id) {
          this.loadParcels(this.customer.id);
        }
      },
      error: (err) => console.log(err)
    });
  }
 
  /**
   * Pulls the customer's full parcel list via the existing
   * GET /api/parcels/customer/{customerId} endpoint and
   * computes the stat counters + recent list client-side.
   * (No backend "summary" endpoint required.)
   */
  loadParcels(customerId: number): void {
    this.parcelService.getByCustomer(customerId).subscribe({
      next: (parcels) => {
        const list = parcels || [];
 
        this.stats = {
          total:     list.length,
          pending:   list.filter(p => p.status === 'PENDING').length,
          inTransit: list.filter(p => p.status === 'IN_TRANSIT' || p.status === 'AT_HUB' || p.status === 'OUT_FOR_DELIVERY').length,
          delivered: list.filter(p => p.status === 'DELIVERED').length,
        };
 
        this.recentParcels = [...list]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
 
        this.cdr.markForCheck();
      },
      error: (err) => console.log(err)
    });
  }
 
  logout(): void {
    this.auth.logout();
    this.storage.removeData(KEYS.CUSTOMER);
  }
 
  badgeClass(status: ParcelStatus): string {
    return PARCEL_STATUS_META[status]?.badge ?? 'bg-secondary';
  }
 
  badgeLabel(status: ParcelStatus): string {
    return PARCEL_STATUS_META[status]?.label ?? status;
  }

}
