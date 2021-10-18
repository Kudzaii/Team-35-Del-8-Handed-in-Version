import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    // ResetForm: FormGroup;
    submitted = false;
    ResetForm: FormGroup = this.formBuilder.group({
      old_password: ['',Validators.required,],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
  }, {
    validators: ConfirmedValidator('password', 'confirm_password'), asyncValidators: passwordMatchValidator('password', 'old_password')
  });
  constructor( private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.formInit()
  }

  formInit() {

  }

    // convenience getter for easy access to form fields
    get f() { return this.ResetForm.controls; }

    onSubmit() {
      this.submitted = true;
      console.log(this.ResetForm.value)
      this.authService.ResetPassword(this.ResetForm.value).subscribe(res=>{
        if(res==null){

        }
        else{
          swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Password Successfully Reset!',
              showConfirmButton: false,
              timer: 2000,
            })
            this.ResetForm.reset();
        }
      })
    }
}


export function passwordMatchValidator(value1,value2) {
  return value1 != value2
     ? null : {'mismatch': true};
}
export function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
