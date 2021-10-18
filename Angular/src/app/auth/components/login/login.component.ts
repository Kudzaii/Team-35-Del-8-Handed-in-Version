import { User } from './../../../models/user.model';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { IdleService } from 'src/app/shared/services/idle.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  LoginForm: any
  Spinner:boolean =  false;
  constructor(private AuthServe:AuthService,public router:Router,     private idle: IdleService, private location: Location) {

   }

  ngOnInit(): void {

  }

  onSubmit(user:User){
    this.Spinner = true;
    if(user.Username=="" || user.Password=="") {

      swal.fire('Please fill all the required fields to create a super hero!')

    } else {


      user.Email_Address =user.Username
     this.AuthServe.Login(user).subscribe(()=>{
        this.Spinner = false;
        this.idle.Timer();

      });
      // this.Spinner =  this.AuthServe.SetLoadingSpanner(request)
      // this.AuthServe.SeUpLoginData(request)

    }
  }
  goBack(): void {
    this.location.back();
  }
}
