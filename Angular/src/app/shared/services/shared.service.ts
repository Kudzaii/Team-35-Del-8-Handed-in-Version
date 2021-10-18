import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
 import { environment } from 'src/environments/environment';
const rootURL = environment.baseUrl+'/Report/'
const   AdrootURL =  environment.baseUrl+'/Admin/'



@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(public http : HttpClient,
   private auth:AuthService) { }


  compare(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA, 'DD/MM/YYYY');
    var momentB = moment(dateTimeB, 'DD/MM/YYYY');
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }
  reFormatDate(Date:any){
    const momentDate = new Date(Date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    return formattedDate;
  }

  ClientAudit(clientId?:number){
      let id =clientId;
      if(isNaN(clientId)){
        id =  Number(this.auth.loginId)
        console.log( this.auth.loginId)
      }
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      return this.http.get(`${rootURL}ClientAuditReport/${id}`,httpOptions).pipe(share());

  }

  ViewClients(): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(`${rootURL}ViewClients`).pipe(share());
  }

  UpdateTimer(time){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  return this.http.post(`${AdrootURL}UpdateTimer/${time}`,httpOptions).pipe(share());

}

getTime() {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  return this.http.get<any[]>(`${AdrootURL}getTimer`).pipe(share());
}



}
