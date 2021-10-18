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


const rootURL = environment. baseUrl+ '/Admin/';
const TraineerootURL = environment. baseUrl+'/Trainee/';


@Injectable({
  providedIn: 'root',
})
export class TraineesService {
  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private auth: AuthService
  ) {}

  /**
   * !  Note: Missing API for getting Trainees
   * @returns
   */
  getTrainees(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/GetTrainees`).pipe(share());
  }

  DisableTrainee(TraineeID) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/DisableTraineeProfile/${TraineeID}`,
      httpOptions
    );
  }

  AcceptORejectTrainee(trainee: any, decision: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(
      `${rootURL}/AcceptorDeclineTraineeRequest/${trainee}/${decision}`,
      trainee,
      httpOptions
    );
  }

  getTraineeRegistrations(): Observable<any[]> {
    return this.http
      .get<any[]>(`${rootURL}/TraineeRegistrationRequest`)
      .pipe(share());
  }

  getTraineeProfile(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${TraineerootURL}ViewTraineeProfile/${id}`)
      .pipe(share());
  }

  MaintainTrainee(user:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`environment.baseUrl/Trainee/MantainTrainee/${this.auth.loginId}`,user, httpOptions);


  }


}
