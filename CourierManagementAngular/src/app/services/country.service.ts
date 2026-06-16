import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../components/feature/address/country/country';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CountryModel } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {


  private apiUrl = environment.apiUrl+"country/";

  constructor(private http: HttpClient) { }


  getAll(): Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>(this.apiUrl);
  }


  getById(id: number): Observable<CountryModel> {
    return this.http.get<CountryModel>(`${this.apiUrl}${id}`);
  }


  save(country: CountryModel): Observable<CountryModel> {
    return this.http.post<CountryModel>(this.apiUrl, country);
  }


  update(id: number, country: CountryModel): Observable<CountryModel> {
    return this.http.put<CountryModel>(
      `${this.apiUrl}${id}`,
      country
    );
  }


  delete(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { responseType: 'text' }
    );
  }

}
