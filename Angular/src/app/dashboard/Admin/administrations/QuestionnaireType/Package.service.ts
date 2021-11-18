import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { AuthService } from '../../../../auth/auth.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service'
import { Package } from '../../../../models/Package';
const rootURL = environment. baseUrl+ '/Admin/';
import swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(public http : HttpClient,public router:Router, private auth:AuthService) { }



  // Get Packages

  getPackages() {
    return this.http.get(`${rootURL}/GetPackages`).pipe(share());
  }

   //get Client ID
   get ClientID()
   {
     let id =  this.auth.loginId //ClientID
     return Number(id);
   }


  /**
   * Client Type crud
   */
  AddPackage(Package: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

   // return this.http.post(`https://apifics.azurewebsites.net/AddPackage/`, Client, httpOptions);
   return this.http.post(
    `${rootURL}/AddPackage/`,
    Package,
    httpOptions
  );
  }

  UpdatePackage(Package, id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(
      `${rootURL}/MaintainPackage/${id}`,
      Package,
      httpOptions
    );
  }
  Removepackage(id) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(`${rootURL}/removePackage/${id}`, httpOptions);
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

  ViewPackageWithPrice(): Observable<any[]> {
    return this.http
      .get<any[]>(`${rootURL}ViewPackageWithPrice/`)
      .pipe(share());
  }
}
