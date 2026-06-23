import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerResponseModel } from '../models/customer.model';
import { Agent, AgentResponseModel } from '../models/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {


  private apiUrl = environment.apiUrl + "agents";


  constructor(private http: HttpClient) { }

  // =========================
  // Agent CRUD
  // =========================

  getAllAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAgentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAgentsByHub(hubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hub/${hubId}`);
  }

  createAgent(agent: any, image?: File): Observable<any> {
    const formData = new FormData();

    formData.append(
      'agent',
      new Blob([JSON.stringify(agent)], { type: 'application/json' })
    );

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  updateAgent(id: number, agent: any, image?: File): Observable<any> {
    const formData = new FormData();

    formData.append(
      'agent',
      new Blob([JSON.stringify(agent)], { type: 'application/json' })
    );

    if (image) {
      formData.append('image', image);
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  // =========================
  // Parcel Operations
  // =========================

  bookParcel(parcelData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/parcels/book`,
      parcelData
    );
  }

  getHubParcels(agentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${agentId}/parcels`
    );
  }

  getHubParcelsByStatus(
    agentId: number,
    status: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${agentId}/parcels/status/${status}`
    );
  }

  updateParcelStatus(
    agentId: number,
    parcelId: number,
    statusData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${agentId}/parcels/${parcelId}/status`,
      statusData
    );
  }
  

   findByUserId(id: number | null): Observable<AgentResponseModel> {
      return this.http.get<AgentResponseModel>(this.apiUrl +"/user/"+ id);
    }
  




}
