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
    return this.http.get<RiderResponseModel[]>(this.apiUrl + "/");
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

    return this.http.post<RiderResponseModel>(this.apiUrl + "/", formData);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }


  update(id: number, rider: RiderRequestModel, image?: File): Observable<RiderResponseModel> {
    const formData = new FormData();
    formData.append('rider', new Blob([JSON.stringify(rider)], { type: 'application/json' }));
    if (image) formData.append('image', image);
    return this.http.put<RiderResponseModel>(`${this.apiUrl}/${id}`, formData);
  }



  findByUserId(id: number | null): Observable<RiderResponseModel> {
    return this.http.get<RiderResponseModel>(this.apiUrl + "/user/" + id);
  }



  // =========================
  // Status toggle
  // =========================

  /** PATCH /api/riders/{id}/active?value=true */
  setActive(id: number, value: boolean): Observable<RiderResponseModel> {
    return this.http.patch<RiderResponseModel>(
      `${this.apiUrl}/${id}/active`,
      null,
      { params: { value } }
    );
  }

  // =========================
  // Zone / coverage queries
  // =========================

  /** All riders covering a specific police station */
  getByPoliceStation(policeStationId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(
      `${this.apiUrl}/police-station/${policeStationId}`
    );
  }

  /** Only ACTIVE riders covering a specific police station */
  getActiveByPoliceStation(policeStationId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(
      `${this.apiUrl}/police-station/${policeStationId}/active`
    );
  }

  /** All riders covering any police station in a given district */
  getByDistrict(districtId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(
      `${this.apiUrl}/district/${districtId}`
    );
  }

  /** Only ACTIVE riders covering any police station in a given district */
  getActiveByDistrict(districtId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(
      `${this.apiUrl}/district/${districtId}/active`
    );
  }


}
