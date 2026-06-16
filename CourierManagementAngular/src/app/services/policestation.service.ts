import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  PoliceStationModel } from '../models/policeStation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PolicestationService {

  private apiUrl =environment.apiUrl+ 'policeStation';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/');
  }

  save(data: PoliceStationModel): Observable<any> {
    return this.http.post(this.apiUrl+"/", data);
  }

  update(id: number, data: PoliceStationModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getByDistrictId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/district/${id}`);
  }

  search(keyword: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`);
}


}
