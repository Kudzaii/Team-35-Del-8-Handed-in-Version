import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const rootURL = environment.baseUrl+'/Report/';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(public http: HttpClient, private auth: AuthService) {}

  ViewUserRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/ViewUserRoles`).pipe(share());
  }

  RegisteredUsersReport(id:number, date:any): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/RegisteredUsersReport/${id}/${date}`).pipe(share());
  }

  InactiveUsersReport(id:number, date:any): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/InactiveUsersReport/${id}/${date}`).pipe(share());
  }

  BookingsPerPackage( date:any): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/BookingsPerPackage/${date}`).pipe(share());
  }

  ViewTrainees(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/ViewTrainees`).pipe(share());
  }

  TraineePerformanceReport( id:any): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/TraineePerformanceReport/${id}`).pipe(share());
  }

  ViewClients(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/ViewClients`).pipe(share());
  }


  ClientAuditReport( id:any): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/ClientAuditReport/${id}`).pipe(share());
  }

}
