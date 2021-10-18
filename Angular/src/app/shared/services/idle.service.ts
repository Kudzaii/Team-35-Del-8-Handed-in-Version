import { Injectable, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from './shared.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class IdleService {

  constructor(private authService: AuthService, private idle:Idle, private sharedService: SharedService,
    ) {
        this.setTimeToASession()
     }
     idleState = 'Not started.';
     timedOut = false;


     setTimeToASession() {
      this.sharedService.getTime().subscribe(result => {
        sessionStorage.setItem('time', result.toString())
      })
     }
     onLogout() {
       this.authService.logout();
     }
     title = 'PROCODEIT-FICS';
     Timer(idletime?) {
      if(sessionStorage.getItem("User_ID") != null)
      {
        let time = 10000;
        let idle = Number( sessionStorage.getItem('time'))
        if(idletime != null)
        {
          idle = idletime;
        }
        console.log(idle);
         // sets an idle timeout of 5 seconds, for testing purposes.
         this.idle.setIdle(idle);
         // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
         this.idle.setTimeout(time);
         // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
         this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

         this.idle.onIdleEnd.subscribe(() => (""));
         this.idle.onTimeout.subscribe(() => {
           //alert( this.idleState);
           this.idleState = 'Timed out!';

           this.timedOut = true;
         });
         this.idle.onIdleStart.subscribe(
           () => (this.idlePopUp(Number(time)))
         );
        //  this.idle.onTimeoutWarning.subscribe(
        //    countdown =>
        //      (console.log(this.idleState = 'You will time out in ' + countdown + ' seconds!'))
        //  );
         this.reset();

      }

     }

     idlePopUp(time) {
      let timerInterval;
      Swal.fire({
        title: ' You have gone idle!',
        html: 'The page will redirect you to the login page in <b></b> minutes.',
        timer: time,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b: any = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            let v
            b.textContent = ((Swal.getTimerLeft() /1000)%60).toFixed(0);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        this.reset()
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          this.onLogout()
          this.idle.ngOnDestroy();
        }
      });
    }

    reset() {
      this.setTimeToASession();
       this.idle.watch();
       this.idleState = 'Started.';
       this.timedOut = false;
     }
   }
