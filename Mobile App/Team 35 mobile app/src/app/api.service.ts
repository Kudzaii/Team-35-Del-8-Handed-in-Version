import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': "application/json",
    'Access-Control-Allow-Origin': "*"
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'https://localhost:44389/api/Client/';  

  constructor(private http: HttpClient) { }  

  ViewSchedule(clientid: number) {
    return this.http.get(this.url + 'ViewSchedule/' + clientid);  
  }  

  ViewTasks(clientid: number) {
    return this.http.get(this.url + 'ViewTasks/' + clientid);  
  }  
  ViewTask(taskid: number) {
    return this.http.get(this.url + 'ViewTask/' + taskid);  
  }  
  CompleteTask(task ,taskid: number) {
    return this.http.post(this.url + 'CompleteTask/' + taskid, task, httpOptions);  
  }  


  Login(user) {

    return this.http.post('https://localhost:44389/api/Access/MobileAppLogin/', user , httpOptions);  
  }  
  ForgotPassword(email) {
    console.log('reset');
    console.log(email);
    return this.http.post('https://localhost:44389/api/Access/ForgotPassword', email, httpOptions);  
  }  
}

export interface Schedule {
  id: number;
  Title: string;
  Name: string;
  Surname: string;
  Email: string;
  UserRole: string;
  password: string;
  confirmPassword: string;
}