import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
const rootURL = environment.baseUrl+'/Admin/';

@Injectable({
  providedIn: 'root',
})
export class PractitionerService {
  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private auth: AuthService
  ) {}

  getPractitioners(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/GetPractitioners`).pipe(share());
  }

  DisablePractitioner(PracID) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(
      `${rootURL}/DisablePractitionerProfile/${PracID}`,
      httpOptions
    );
  }

  getPractitionerRegistrations(): Observable<any[]> {
    return this.http
      .get<any[]>(`${rootURL}/PractitionerRegistrationRequest`)
      .pipe(share());
  }

  AcceptORejectPractitioner(Practitioner: any, decision: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(
      `${rootURL}/AcceptorDeclinePractitionerRequest/${Practitioner}/${decision}`,
      Practitioner,
      httpOptions
    );
  }

  AssignPractitionerToClient(PractitionerID: number, ClientID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }),};
    return this.http.post(
      `${rootURL}/AssignPractitionertoClient/${ClientID}/${PractitionerID}`,
      httpOptions
    );
  }
  getPractitionerProfile(id:number): Observable<any[]> {
    return this.http
      .get<any[]>(`${rootURL}/ViewPractitionerProfile`)
      .pipe(share());
  }

}
