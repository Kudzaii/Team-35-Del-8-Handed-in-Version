import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';  
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  constructor(private service: ApiService,  private router: Router,  private formbulider: FormBuilder) { }
  form : any;
  user : any;

  ngOnInit(): void {
    this.form = this.formbulider.group({  
      Email: ['', [Validators.required]],  
    }); 
  }

  reset(e){
    let email = {
      "Email_Address": e.target.Email.value,
    }

    this.service.ForgotPassword(email).subscribe((x) => {
      this.user = x;
      console.log(x);
      })
  }
}
