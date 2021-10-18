import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, observable, Observable, of} from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service'
import { Client } from 'src/app/models/Client';
import { Session } from 'src/app/models/Session';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
const rootURL = environment. baseUrl+'/Client/'


@Injectable({
  providedIn: 'root'
})
export class ClientService {


  constructor(public http : HttpClient,public router:Router,@Inject(SESSION_STORAGE) private storage: StorageService, private auth:AuthService) { }

  /**
   * Used to get Client profile
   * @param id
   * @returns observable
   */
  geClientProfile(id : number)
  {
    return this.http.get(`${rootURL}/ViewClientProfile/${id}`).pipe(share());;
  }

  /**
   * ?Used to update the client profile
   * @param formData
   * @returns
   */
   UpdateClient(formData){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post(environment.baseUrl+'/Client/MaintainClientProfile/', formData,httpOptions).pipe(share());


  }
  //get Client ID
  get ClientID()
  {
    let id =  this.auth.loginId //ClientID
    return Number(id);
  }



  // Get Sessions
  getSessions(id?: number):Observable<Session[]>
  {
    return this.http.get<Session[]>(`${rootURL}/ViewSchedule/${this.ClientID}`).pipe(share());
  }


  //Get session feedback
  getReviewSessionFeedback(SessionID:Number){
    let request:any;
    console.log(SessionID)
    if(SessionID == null)
    {
      request = of("SessionID is Null")
    }
    else{
      request =this.http.get(`${rootURL}/ReviewSessionFeedback/${SessionID}`);
    }
    return request
  }


  // Get Packages

  getPackages() {
    return this.http.get(`${rootURL}/ViewPackages/`).pipe(share());
  }

    // Get Packages

    getMyPackages() {
      return this.http.get(`${rootURL}/GetClientPackages/${this.ClientID}`).pipe(share());
    }

  getClientPurchasedPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${rootURL}/GetClientPackages/${this.ClientID}`).pipe(share());
  }
  /**
   * ?Purchase Package
   *
   */

  PurchasePackage(PurchaseObject){

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    this.storage.set("Package",PurchaseObject.Package_ID )
    return this.http.post(`${rootURL}/PurchasePackages/${PurchaseObject.Package_ID}/${PurchaseObject.Client_ID}/${PurchaseObject.Quantity}`,httpOptions);

  }

  /**
   * get Trial Questionnaires
   */

   getTrialQuestionnaire() {
    return this.http.get(`${rootURL}/TrialQuestionnaire/`).pipe(share());
  }


  /**
   *  get
   */

   ClientQuestionnaire() {
    return this.http.get(`${rootURL}/ViewClientQuestionnares/${this.ClientID}`).pipe(share());
  }

  CompleteQuestionnaire(questions:Array<Array<any>>){
    console.log(questions)
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}CompleteQuestionnare`,questions,httpOptions).pipe(share())
  }
  /**
   *
   * @param _ClientID
   * @returns
   */

   getTasks(_ClientID?:number) {
     let Id:number = this.ClientID
     if(_ClientID!=null)
        {
          Id =_ClientID
        }
    return this.http.get(`${rootURL}/GetTasks/${Id}`).pipe(share());
  }


  /**
   * get Tasks
   */

   ProgressReport() {
    return this.http.get(`${rootURL}/ViewProgressReport/${this.ClientID}`).pipe(share());
  }
  /**
   * get Tasks and complete task
   */



  CompleteTask(Task:any ,taskID:number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}/CompleteTask/${taskID}`,Task,httpOptions).pipe(share());
  }

  getFeedbacks():Observable<any[]>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.get<any[]>(`${rootURL}/ViewFeedbackNotes/${this.ClientID}`).pipe(share());
  }


  /**
   * Booking a slot
   */

  BookSlot(BookingIDs,availability_id){
    BookingIDs.Client_ID = this.ClientID;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}/BookSession/${availability_id}`,BookingIDs,httpOptions).pipe(share());
  }

  RescheduleSession(BookingIDs,availability_id){
    BookingIDs.Client_ID = this.ClientID;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}/RescheduleSession/${availability_id}`,BookingIDs,httpOptions).pipe(share());
  }

  getDateAvailability(Date:any):Observable<any[]>{
    return this.http.get<any[]>(`${rootURL}GetDateAvailability/${Date}`).pipe(share());
  }

  // ?\https://stackblitz.com/edit/am-all-imports-7gm3wt?file=app%2Fapp.component.ts
  getAvailableDates():Observable<any[]>{
    return this.http.get<any[]>(`${rootURL}GetPractitionerAvailableDates/${Number( sessionStorage.getItem('Practitioner_ID'))}`).pipe(share());
  }
}
