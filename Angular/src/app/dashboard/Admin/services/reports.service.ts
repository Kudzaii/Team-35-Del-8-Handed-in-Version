import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

const rootURL = environment.baseUrl+'/Report/';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(
    public http: HttpClient,
    public router: Router,
    private auth: AuthService
  ) {}

}
