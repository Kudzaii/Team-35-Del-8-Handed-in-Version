import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  constructor(public http: HttpClient) {}

  getCountries() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(`https://countriesnow.space/api/v0.1/countries `).pipe(share());
  }
}
