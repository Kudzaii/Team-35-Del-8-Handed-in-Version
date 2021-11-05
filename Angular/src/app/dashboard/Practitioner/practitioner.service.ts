import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, observable, Observable, of} from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service'
import { Session } from 'src/app/models/Session';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
const rootURL = environment. baseUrl+'/Client/'


@Injectable({
  providedIn: 'root'
})
export class PractitionerService {


  constructor(public http : HttpClient,public router:Router,@Inject(SESSION_STORAGE) private storage: StorageService, private auth:AuthService) { }

  /**
   * Used to get Client profile
   * @param id
   * @returns observable
   */
  getPractitionerProfile(id : number)
  {
    return this.http.get(`${rootURL}/ViewClientProfile/${id}`).pipe(share());;
  }

  /**
   * ?Used to update the client profile
   * @param formData
   * @returns
   */
   UpdatePractitioner(formData){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post(environment.baseUrl+'/Client/MaintainClientProfile/', formData,httpOptions).pipe(share());


  }
  //get Practitioner ID
  get PractitionerID()
  {
    let id =  this.auth.loginId //ClientID
    return Number(id);
  }



  // Get Sessions
  getSessions(id?: number):Observable<Session[]>
  {
    return this.http.get<Session[]>(`${rootURL}/ViewSchedule/${this.PractitionerID}`).pipe(share());
  }
}