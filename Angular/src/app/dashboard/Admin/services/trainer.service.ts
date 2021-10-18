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


const rootURL = environment. baseUrl+'/Admin/';
const TrainerrootURL = environment. baseUrl+ '/Trainer/';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private auth: AuthService
  ) {}

  getTrainers(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/GetTrainers`).pipe(share());
  }

  DisableTrainer(TrainerID) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/DisableTrainerProfile/${TrainerID}`,
      httpOptions
    );
  }

  AcceptORejectTrainer(trainer: any, decision: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(
      `${rootURL}/AcceptorDeclineTrainerRequest/${trainer}/${decision}`,
      trainer,
      httpOptions
    );
  }

  getTrainerRegistrations(): Observable<any[]> {
    return this.http
      .get<any[]>(`${rootURL}/TrainerRegistrationRequest`)
      .pipe(share());
  }



  AssignTrainerToTrainee(TrainerID: number, TraineeID: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }),};
    return this.http.post(
      `${rootURL}/AssignTrainertoTrainee/${TraineeID}/${TrainerID}`,
      httpOptions
    );
  }
  getTrainerProfile(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${TrainerrootURL}ViewTrainerProfile/${id}`)
      .pipe(share());
  }

  MaintainTrainer(user:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(`${TrainerrootURL}/MaintainTrainer/${this.auth.loginId}`,user, httpOptions);
  }

}
