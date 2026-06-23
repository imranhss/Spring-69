import { Injectable } from '@angular/core';
import { RiderResponseModel } from '../models/rider.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RiderzoneService {


  private apiUrl = environment.apiUrl + 'rider-zones';
 
  constructor(private http: HttpClient) { }
 
  // Get all zones (police stations) assigned to a rider
  getZonesForRider(riderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rider/${riderId}`);
  }
 
  // Get all riders covering a specific police station
  getRidersForPoliceStation(policeStationId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(`${this.apiUrl}/police-station/${policeStationId}`);
  }
 
  // Get only ACTIVE riders for a police station (for parcel assignment)
  getActiveRidersForPoliceStation(policeStationId: number): Observable<RiderResponseModel[]> {
    return this.http.get<RiderResponseModel[]>(`${this.apiUrl}/police-station/${policeStationId}/active`);
  }
 
  // Add zones to a rider without removing existing ones
  addZones(riderId: number, policeStationIds: Set<number>): Observable<RiderResponseModel> {
    return this.http.post<RiderResponseModel>(
      `${this.apiUrl}/rider/${riderId}/add`,
      Array.from(policeStationIds)
    );
  }
 
  // Remove specific zones from a rider
  removeZones(riderId: number, policeStationIds: Set<number>): Observable<RiderResponseModel> {
    return this.http.post<RiderResponseModel>(
      `${this.apiUrl}/rider/${riderId}/remove`,
      Array.from(policeStationIds)
    );
  }
 
  // Replace ALL zones at once (full sync)
  setZones(riderId: number, policeStationIds: Set<number>): Observable<RiderResponseModel> {
    return this.http.put<RiderResponseModel>(
      `${this.apiUrl}/rider/${riderId}`,
      Array.from(policeStationIds)
    );
  }
}
