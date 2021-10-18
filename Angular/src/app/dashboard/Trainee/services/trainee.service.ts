import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Session } from 'src/app/models/Session';

 import { environment } from 'src/environments/environment';
const rootURL = environment.baseUrl+'/Trainee/'



@Injectable({
  providedIn: 'root'
})
export class TraineeService {



  constructor(public http : HttpClient, private auth:AuthService) { }

  /**
   * Used to get Trainee profile
   * @param id
   * @returns observable
   */
  geTraineeProfile(id : number)
  {
    return this.http.get(`${rootURL}/ViewTraineeProfile/${id}`).pipe(share());;
  }

  /**
   * ?Used to update the Trainee profile
   * @param formData
   * @returns
   */
  UpdateTrainee(formData){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}

    return this.http.post(environment.baseUrl+'/Trainee/MaintainTrainee/', formData,httpOptions).pipe(share());


  }

  //get Trainee ID
  get TraineeID()
  {
    let id =  this.auth.loginId //TraineeID
    return Number(id);
  }



  // Get Sessions
  getSessions(id?: number):Observable<Session[]>
  {
    return this.http.get<Session[]>(`${rootURL}/ViewSchedule/${this.TraineeID}`).pipe(share());
  }


  //Get session feedback
  getReviewSessionFeedback(SessionID:Number){
    let request:any;

    if(SessionID == null)
    {
      request = "SessionID is Null"
    }
    else{
      request =this.http.get(`${rootURL}/ReviewSessionFeedback/${SessionID}`);
    }
    return of(request)
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

   TraineeQuestionnaire() {
    return this.http.get(`${rootURL}/ViewTraineeQuestionnares/${this.TraineeID}`).pipe(share());
  }

  CompleteQuestionnaire(questions:Array<Array<any>>){
    console.log(questions)
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}CompleteQuestionnare`,questions,httpOptions).pipe(share())
  }
  /**
   *
   * @param _TraineeID
   * @returns
   */

   getTasks(_TraineeID?:number) {
     let Id:number = this.TraineeID
     if(_TraineeID!=null)
        {
          Id =_TraineeID
        }
    return this.http.get(`${rootURL}/GetTasks/${Id}`).pipe(share());
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
     return this.http.get<any[]>(`${rootURL}/ViewFeedbackNotes/${this.TraineeID}`).pipe(share());
  }



  RescheduleSession(BookingIDs,availability_id){
    BookingIDs.Trainee_ID = this.TraineeID;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}/RescheduleSession/${availability_id}`,BookingIDs,httpOptions).pipe(share());
  }

  /**
   * Booking a slot
   */

  BookSlot(BookingIDs,availability_id){
    // BookingIDs.Package_ID =  Number(this.storage.get("Package"))
    BookingIDs.Trainee_ID = this.TraineeID;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
     return this.http.post(`${rootURL}/BookSession/${availability_id}`,BookingIDs,httpOptions).pipe(share());
  }

  getDateAvailability(Date:any):Observable<any[]>{
    return this.http.get<any[]>(`${rootURL}GetDateAvailability/${Date}`).pipe(share());
  }

  // ?\https://stackblitz.com/edit/am-all-imports-7gm3wt?file=app%2Fapp.component.ts
  getAvailableDates():Observable<any[]>{
    return this.http.get<any[]>(`${rootURL}GetAvailableDates/`).pipe(share());
  }



}
