import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DivisionModel } from '../models/division.model';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {

  private apiUrl = environment.apiUrl+"division/";

  constructor(private http: HttpClient) { }


  getAll(): Observable<DivisionModel[]> {
    return this.http.get<DivisionModel[]>(this.apiUrl);
  }


  getById(id: number): Observable<DivisionModel> {
    return this.http.get<DivisionModel>(`${this.apiUrl}${id}`);
  }


  save(division: DivisionModel): Observable<DivisionModel> {
    return this.http.post<DivisionModel>(this.apiUrl, division);
  }


  update(id: number, division: DivisionModel): Observable<DivisionModel> {
    return this.http.put<DivisionModel>(
      `${this.apiUrl}${id}`,
      division
    );
  }


  delete(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { responseType: 'text' }
    );
  }

  getByCountryId(id: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}country/${id}`);
}


}
