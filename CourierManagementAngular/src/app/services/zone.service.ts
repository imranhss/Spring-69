import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PoliceStationResponseDTO, RiderResponseDTO } from '../models/zone.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {

   private baseUrl = `${environment.apiUrl}rider-zones`;

  constructor(private http: HttpClient) {}

  /** Get all thanas (police stations) assigned to a rider */
  getZonesForRider(riderId: number): Observable<PoliceStationResponseDTO[]> {
    return this.http.get<PoliceStationResponseDTO[]>(
      `${this.baseUrl}/rider/${riderId}`
    );
  }

  /** Get all riders who cover a specific thana */
  getRidersForPoliceStation(policeStationId: number): Observable<RiderResponseDTO[]> {
    return this.http.get<RiderResponseDTO[]>(
      `${this.baseUrl}/police-station/${policeStationId}`
    );
  }

  /** Get only ACTIVE riders for a thana (used when assigning a parcel) */
  getActiveRidersForPoliceStation(policeStationId: number): Observable<RiderResponseDTO[]> {
    return this.http.get<RiderResponseDTO[]>(
      `${this.baseUrl}/police-station/${policeStationId}/active`
    );
  }

  /** Add thanas to a rider (keeps existing ones) */
  addZones(riderId: number, policeStationIds: number[]): Observable<RiderResponseDTO> {
    return this.http.post<RiderResponseDTO>(
      `${this.baseUrl}/rider/${riderId}/add`,
      policeStationIds
    );
  }

  /** Remove specific thanas from a rider */
  removeZones(riderId: number, policeStationIds: number[]): Observable<RiderResponseDTO> {
    return this.http.post<RiderResponseDTO>(
      `${this.baseUrl}/rider/${riderId}/remove`,
      policeStationIds
    );
  }

  /** Replace ALL zones at once (full sync — admin zone picker) */
  setZones(riderId: number, policeStationIds: number[]): Observable<RiderResponseDTO> {
    return this.http.put<RiderResponseDTO>(
      `${this.baseUrl}/rider/${riderId}`,
      policeStationIds
    );
  }
}
