import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';  
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private service: ApiService,  private router: Router,  private formbulider: FormBuilder) { }
  form : any;
  user : any;

  ngOnInit(): void {
    this.form = this.formbulider.group({  
      Username: ['', [Validators.required]],  
      Password: ['', [Validators.required]],   
    }); 
  }

  login(e){
    let user = {
      "Username": e.target.Username.value,
      "Email_Address": e.target.Username.value,
      "Password": e.target.Password.value
    }

    this.service.Login(user).subscribe((x) => {
      this.user = x;
      console.log(x);

        if (x[0].User_ID)
        {
          localStorage["User_ID"] = x[0].User_ID;
          localStorage["Username"] = x[0].Username;
          localStorage["EmailAddress"] = x[0].EmailAddress;
          localStorage["SessionID"] = x[0].SessionID;
          localStorage["UserRole_ID"] = x[0].UserRole_ID;
          localStorage["Client_ID"] = x[0].LoginID;

          this.router.navigate(["viewschedule"])
        }
        else
        {
          this.router.navigate(["home"])
        }
      })

  }

    reset(){
      this.router.navigate(["reset"])
    }


}
