import { Component, OnInit } from '@angular/core';;
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from './shared/services/shared.service';
import Swal from 'sweetalert2';
import { IdleService } from './shared/services/idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(private authService: AuthService, private idle:IdleService, private sharedService: SharedService,
   ) {
    }
  idleState = 'Not started.';
  timedOut = false;
  RoleName:string

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    //this.sharedService.getTime().subscribe(result => {console.log(result)})
    if(this.isLoggedIn$ && this.authService.Role != null && this.authService.loginId !=null &&  sessionStorage.getItem("User_ID") != null) {

      this.idle.Timer();
    }
  }
  onLogout() {
    
    Swal.fire({
      title: 'Are You Sure You Want To Logout?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout()
      }
      else {

      }
    })
    ;
  }
}