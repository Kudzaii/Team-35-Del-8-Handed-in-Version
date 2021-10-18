import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Location } from '@angular/common'
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  Spinner= false;
  emailaddress:string
  constructor(private auth: AuthService, private router: Router, private location: Location) {}

  ngOnInit(): void {}

  onSubmit(Email) {
    this.Spinner =true;
      let Email_Address = {
        Email_Address:Email.Username
      }
      this.emailaddress =Email_Address.Email_Address
    this.auth.ForgotPassword(Email_Address).subscribe(
      (result) => {
        if (result === null) {
         this.error()
         this.Spinner= false;
        } else {
          swal
            .fire({
              position: 'top-end',
              icon: 'success',
              title: 'Email Successfully Reset Please Check Your Email!',
              showConfirmButton: false,
              timer: 2000,
            })
            .then(() => {
              this.Spinner= false;
              this.LoginWithOTP();
            });
        }
      },
      (error) => {
        this.Spinner= false;
        this.error();
      }
    );
  }

  error() {
    swal.fire({
      title: 'Redirect',
      text: 'Please Use Your OTP As A Temporary Password',
      timer: 7000,
    }).then(res=>{
       this.router.navigate(['login'])
    });
  }

  async LoginWithOTP(){
    const { value: formValues } = await swal.fire({
      title: 'Login Using OTP Password',
      html:
        `<input id="email" class="swal2-input" type="email" hidden value='${this.emailaddress}'>` +
        '<br><h1>OTP</h1>'+
        '<input id="OTP" class="swal2-input" type="number">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('email')).value,
          (<HTMLInputElement>document.getElementById('OTP')).value,

        ]
      }
    })

    if (formValues) {
      let user:User = {OTP: Number(formValues[1]), Email_Address: formValues[0] }
      console.log(user)
      this.auth.Login(user)
    }
  }

  goBack(): void {
    this.location.back();
  }
}
