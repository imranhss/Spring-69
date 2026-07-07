import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParcelResponse, ParcelStats, ParcelStatus, StatusUpdateRequest } from '../models/parcel.model';
import { AgentParcelRequest } from '../models/agentParcelrequest.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {


  private apiUrl = environment.apiUrl + 'parcels';

  constructor(private http: HttpClient) { }

  // ── Customer ──────────────────────────────────────────────────

  book(dto: AgentParcelRequest): Observable<ParcelResponse> {
    return this.http.post<ParcelResponse>(`${this.apiUrl}/book`, dto);
  }

  // getByCustomer(customerId: number): Observable<ParcelResponse[]> {
  //   return this.http.get<ParcelResponse[]>(`${this.apiUrl}/customer/${customerId}`);
  // }

  track(trackingCode: string): Observable<ParcelResponse> {
    return this.http.get<ParcelResponse>(`${this.apiUrl}/track/${trackingCode}`);
  }

  cancel(id: number, customerId: number): Observable<ParcelResponse> {
    return this.http.patch<ParcelResponse>(
      `${this.apiUrl}/${id}/cancel`,
      null,
      { params: new HttpParams().set('customerId', customerId) }
    );
  }

  // ── Price calculator ──────────────────────────────────────────

  calculateCharge(weight: number, serviceType: string, codAmount: number = 0): Observable<number> {
    const params = new HttpParams()
      .set('weight', weight)
      .set('serviceType', serviceType)
      .set('codAmount', codAmount);
    return this.http.get<number>(`${this.apiUrl}/calculate`, { params });
  }

  // ── Admin ─────────────────────────────────────────────────────

  getAll(): Observable<ParcelResponse[]> {
    return this.http.get<ParcelResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<ParcelResponse> {
    return this.http.get<ParcelResponse>(`${this.apiUrl}/${id}`);
  }

  getPendingUnassigned(): Observable<ParcelResponse[]> {
    return this.http.get<ParcelResponse[]>(`${this.apiUrl}/pending/unassigned`);
  }

  assignRider(parcelId: number, riderId: number): Observable<ParcelResponse> {
    return this.http.patch<ParcelResponse>(`${this.apiUrl}/${parcelId}/assign-rider/${riderId}`, null);
  }

  updateStatus(id: number, dto: StatusUpdateRequest): Observable<ParcelResponse> {
    return this.http.patch<ParcelResponse>(`${this.apiUrl}/${id}/status`, dto);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }



   getByCustomer(customerId: number): Observable<ParcelResponse[]> {
    return this.http.get<ParcelResponse[]>(this.apiUrl + '/customer/' + customerId);
  }
 

getSummaryForCustomer(customerId: number): Observable<{ stats: ParcelStats; recent: ParcelResponse[] }> {
  return this.getByCustomer(customerId).pipe(
    map(parcels => ({
      stats: {
        total: parcels.length,
        inTransit: parcels.filter(p => p.status === 'IN_TRANSIT' || p.status === 'PICKED_UP').length,
        delivered: parcels.filter(p => p.status === 'DELIVERED').length,
        pending: parcels.filter(p => p.status === 'PENDING').length,
      },
      recent: parcels.slice(0, 5),
    }))
  );
}


// In parcel.service.ts — add this one method
getByRider(riderId: number): Observable<ParcelResponse[]> {
  return this.http.get<ParcelResponse[]>(this.apiUrl + `/rider/${riderId}`);
}





}
