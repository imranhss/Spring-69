import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomerResponseModel } from '../models/customer.model';
import { Agent, AgentResponseModel } from '../models/agent.model';
import { ParcelResponse, ParcelStatus, StatusUpdateRequest } from '../models/parcel.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {


  private apiUrl = environment.apiUrl + 'agents';
 
  constructor(private http: HttpClient) { }
 
  // =========================
  // Agent CRUD  (Admin)
  // =========================
 
  getAllAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
 
  getAgentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
 
  /** Fetch the agent entity whose linked user matches the given userId. */
  getAgentByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
 
  /** Alias — same as getAgentByUserId, matches existing component code. */
  findByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
 
  getAgentsByHub(hubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hub/${hubId}`);
  }
 
  createAgent(agent: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('agent', new Blob([JSON.stringify(agent)], { type: 'application/json' }));
    if (image) formData.append('image', image);
    return this.http.post<any>(this.apiUrl, formData);
  }
 
  updateAgent(id: number, agent: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('agent', new Blob([JSON.stringify(agent)], { type: 'application/json' }));
    if (image) formData.append('image', image);
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }
 
  deleteAgent(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
 
  // =========================
  // Parcel operations (Agent)
  // =========================
 
  /**
   * Book a walk-in parcel at the hub counter.
   * POST /api/agents/parcels/book
   * Body shape will be completed once AgentParcelRequestDTO is shared.
   */
  bookParcel(parcelData: any): Observable<ParcelResponse> {
    return this.http.post<ParcelResponse>(`${this.apiUrl}/parcels/book`, parcelData);
  }
 
  /**
   * All parcels at the agent's hub (origin OR destination).
   * GET /api/agents/{agentId}/parcels
   */
  getHubParcels(agentId: number): Observable<ParcelResponse[]> {
    return this.http.get<ParcelResponse[]>(`${this.apiUrl}/${agentId}/parcels`);
  }
 
  /**
   * Hub parcels filtered by a specific status.
   * GET /api/agents/{agentId}/parcels/status/{status}
   */
  getHubParcelsByStatus(agentId: number, status: ParcelStatus): Observable<ParcelResponse[]> {
    return this.http.get<ParcelResponse[]>(
      `${this.apiUrl}/${agentId}/parcels/status/${status}`
    );
  }
 
  /**
   * Update the status of a parcel at the hub.
   * PATCH /api/agents/{agentId}/parcels/{parcelId}/status
   */
  updateParcelStatus(
    agentId: number,
    parcelId: number,
    dto: StatusUpdateRequest
  ): Observable<ParcelResponse> {
    return this.http.patch<ParcelResponse>(
      `${this.apiUrl}/${agentId}/parcels/${parcelId}/status`,
      dto
    );
  }
 
  /**
   * Fetch active riders covering a specific police station.
   * Used to populate the rider dropdown when marking OUT_FOR_DELIVERY.
   * GET /api/rider-zones/police-station/{policeStationId}/active
   */
  getActiveRidersForStation(policeStationId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}rider-zones/police-station/${policeStationId}/active`
    );
  }
 
  /**
   * Preview delivery charge before booking.
   * GET /api/parcels/calculate?weight=2.5&serviceType=EXPRESS&codAmount=1500
   */
  calculateCharge(weight: number, serviceType: string, codAmount: number = 0): Observable<number> {
    const params = new HttpParams()
      .set('weight', weight)
      .set('serviceType', serviceType)
      .set('codAmount', codAmount);
    return this.http.get<number>(`${environment.apiUrl}parcels/calculate`, { params });
  }


}
