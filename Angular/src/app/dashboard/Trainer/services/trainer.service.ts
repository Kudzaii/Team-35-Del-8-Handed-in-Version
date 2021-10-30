import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

import { environment } from 'src/environments/environment';
const rootURL = environment.baseUrl+'/Trainer/';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private auth: AuthService
  ) {}


  GetFeedbackTasks(id:any):Observable<any[]> {
    return this.http
    .get<any[]>(`${rootURL}/GetFeedbackTasks/${id}`)
    .pipe(share());
  }
  SendFeedback( taskid:number,  feedback:string){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(`${rootURL}/SendFeedback/${taskid}/${feedback}`, httpOptions);
  }

  TraineesForPractitioner(id:any):Observable<Task[]> {
    return this.http
    .get<any[]>(`${rootURL}/TraineesFPractitioner/${id}`)
    .pipe(share());
  }

  getTasks(id:any):Observable<Task[]> {
    return this.http
    .get<any[]>(`${rootURL}/TasksForEachTrainee/${id}`)
    .pipe(share());
  }

  AssignTask(trainee_ID: Number, Task: any) {
    let Trainerid= Number(this.auth.loginId)
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/SendTasks/${Trainerid}/${trainee_ID}`,Task, httpOptions);
  }

  TraineesAssignedToTrainer():Observable<any[]> {
    return this.http
    .get<any[]>(`${rootURL}TraineesAssignedToTrainer/${this.auth.loginId}`)
    .pipe(share());
  }
}
<<<<<<< HEAD





=======
>>>>>>> parent of 1edefaf (Merge branch 'main' of https://github.com/Kudzaii/Team-35-Del-8-Handed-in-Version)
