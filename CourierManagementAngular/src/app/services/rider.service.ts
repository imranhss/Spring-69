import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RiderRequestModel, RiderResponseModel } from '../models/rider.model';

@Injectable({
  providedIn: 'root',
})
export class RiderService {


  private apiUrl = environment.apiUrl + 'rider';
 
  constructor(private http: HttpClient) { }
 
  // =========================
  // Rider CRUD
  // =========================
 
  getAll(): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(this.apiUrl+"/");
  }
 
  getById(id: number): Observable<RiderResponseModel> {
    return this.http.get<RiderResponseModel>(`${this.apiUrl}/${id}`);
  }
 
  create(rider: RiderRequestModel, image?: File): Observable<RiderResponseModel> {
    const formData = new FormData();
 
    formData.append(
      'rider',
      new Blob([JSON.stringify(rider)], { type: 'application/json' })
    );
 
    if (image) {
      formData.append('image', image);
    }
 
    return this.http.post<RiderResponseModel>(this.apiUrl+"/", formData);
  }
 
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }


}
