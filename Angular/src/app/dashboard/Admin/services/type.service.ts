import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
const rootURL = environment. baseUrl+ '/Admin/';


import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  constructor(public http: HttpClient, private auth: AuthService) {}



    /**
   * Questionnaire Type crud
   * ? 1:questionBank
   * ? 2: SessionType
   * ? 3: DocumentType
   * ? 4: PackageType
   * ? 5: EventType
   * ? 6: ClientType
   */
     GetTypes(id: number): Observable<any[]> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      return this.http.get<any[]>(`${rootURL}/GetTypes/${id}`);
    }

  /**
   * Questionnaire Type crud
   */
  AddQuestionnaireType(questionnaire: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/AddQuestionnaireType/`,
      questionnaire,
      httpOptions
    );
  }

  UpdateQuestionnaireType(questionnaire, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/MaintainQuestionnaireType/${id}`,
      questionnaire,
      httpOptions
    );
  }

  DeleteQuestionnaireType(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/removeQuestionnaireType/${id}`, httpOptions);
  }

  /**
   * Session Type crud
   */
  AddSessionType(session: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/AddSessionType/`, session, httpOptions);
  }

  UpdateSessionType(session, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/MaintainSessionType/${id}`,
      session,
      httpOptions
    );
  }




  /**
   * Package Type crud
   */
  AddPackageType(Package: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/AddPackageType/`, Package, httpOptions);
  }

  UpdatePackageType(Package, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/MaintainPackageType/${id}`,
      Package,
      httpOptions
    );
  }
  RemovePackageType(id) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/removePackageType/${id}`, httpOptions);
  }

  /**
   * Client Type crud
   */
  AddClientType(Client: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`https://apifics.azurewebsites.net/AddClientType/`, Client, httpOptions);
  }

  UpdateClientType(Client, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/MaintainClientType/${id}`,
      Client,
      httpOptions
    );
  }
  RemoveclientType(id) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/removeClientType/${id}`, httpOptions);
  }

  success(type) {
    swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Successfully Updated ${type} Type!`,
              showConfirmButton: false,
              timer: 2000,
            })
  }
}
