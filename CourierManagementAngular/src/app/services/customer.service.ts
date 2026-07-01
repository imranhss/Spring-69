import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CustomerModel, CustomerResponseModel } from '../models/customer.model';
import { Observable } from 'rxjs';

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


  findByUserId(id: number | null): Observable<CustomerResponseModel> {
    return this.http.get<CustomerResponseModel>(this.apiUrl +"user/"+ id);
  }


   /** All customers — used for admin/agent customer search (track-on-behalf, lists, etc). */
  getAll(): Observable<CustomerResponseModel[]> {
    return this.http.get<CustomerResponseModel[]>(this.apiUrl);
  }
 

   /**
   * Update an existing customer's details (and optionally their photo).
   * PUT /api/customer/{id} — multipart, same pattern as create().
   */
  update(id: number, customer: CustomerModel, image: File | null): Observable<CustomerResponseModel> {
    const formData = new FormData();
 
    formData.append('customer', JSON.stringify(customer));
 
    if (image) {
      formData.append('image', image);
    }
 
    return this.http.put<CustomerResponseModel>(
      this.apiUrl + id, formData
    );
  }
 



}
