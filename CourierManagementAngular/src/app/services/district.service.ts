import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DistrictModel } from '../models/district.model';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {

 private apiUrl = environment.apiUrl+"district/";

  constructor(private http: HttpClient) { }


  getAll(): Observable<DistrictModel[]> {
    return this.http.get<DistrictModel[]>(this.apiUrl);
  }


  getById(id: number): Observable<DistrictModel> {
    return this.http.get<DistrictModel>(`${this.apiUrl}${id}`);
  }


  save(district: DistrictModel): Observable<DistrictModel> {
    return this.http.post<DistrictModel>(this.apiUrl, district);
  }


  update(id: number, district: DistrictModel): Observable<DistrictModel> {
    return this.http.put<DistrictModel>(
      `${this.apiUrl}${id}`,
      district
    );
  }


  delete(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { responseType: 'text' }
    );
  }

  getByDivisionId(id: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}${id}`);
}


}
