import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CustomerModel } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private apiUrl = environment.apiUrl + "customer/";

  constructor(private http: HttpClient) { }



  create(customer: CustomerModel, image: File | null) {
    const formData = new FormData();

    formData.append('customer', JSON.stringify(customer));

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<CustomerModel>(
      this.apiUrl, formData
    );
  }



}
