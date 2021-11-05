import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { FileUpload } from 'src/app/models/fileupload';
import { ExternalService } from 'src/app/shared/services/external.service';
import { AuthService } from '../../auth.service';
import { MustMatch } from './must-match.validator';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formGroup: FormGroup;
  formGroupOthers: FormGroup;
  ApplicationType: number;
  isClient: boolean;
  submitted = false;
  countries =[];
  progress: { percentage: number } = { percentage: 0 };
  progress2: { percentage: number } = { percentage: 0 };
  url = '';
    // ProfilePictureUpload
  currentPPUpload: FileUpload;
  selectedPPFiles: FileList;
  //CV
  selectedTFiles: FileList;
  currentCVUpload: FileUpload;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private Authservice: AuthService,
    private external: ExternalService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.ApplicationType = Number(
      this.activatedRoute.snapshot.params.ApplicationTypeId
    );
    if (this.ApplicationType == 1) {
      this.createClientForm();
      this.isClient = true;
    } else {
      this.createOtherForm();
    }
  }

  onSubmit(client: Client, role: number) {

    Swal.fire({
      title: "Thank You For Your Application. You Will Be Hearing From The FICS Corp Team Soon. Please Check Your Email For Acceptance.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Apply Now'
    }).then((result) => {
      if (result.isConfirmed) {
           this.uploads();
            let Role = Number(role) + Number(1);
            client.Contact_Number;
            this.submitted = false;
            console.log(client);


   this.Authservice.Register(client, Role, this.currentPPUpload, this.currentCVUpload);
  }
})
}
  createOtherForm() {
    let emailregex: RegExp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroupOthers = this.formBuilder.group(
      {
        Title: [null, Validators.required],
        Name: [null, Validators.required],
        Surname: [null, Validators.required],
        Contact_Number: [null, [Validators.required], PatternValidator, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        ID_Number: [null, Validators.required],
        Email_Address: [
          null,
          [Validators.required, Validators.pattern(emailregex)],
        ],
        Physical_Address: [null, Validators.required],
        Gender: [null, [Validators.required]],
        Password: [null, [Validators.required, this.checkPassword]],
        Confirm_Password: ['', Validators.required],
      },
      {
        validator: MustMatch('Password', 'Confirm_Password'),
      }
    );
  }
  createClientForm() {
    let emailregex: RegExp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.formGroup = this.formBuilder.group(
      {
        Title: [null, Validators.required],
        Name: [null, Validators.required],
        Surname: [null, Validators.required],
        Email_Address: [
          null,
          [Validators.required, Validators.pattern(emailregex)],
        ],
        Passport_Number: [null, [Validators.required, Validators.maxLength(9)]],
        ID_Number: [null, Validators.required],
        Contact_Number: [null, [Validators.required, Validators.maxLength(10)]],
        Gender: [null, [Validators.required]],
        Country: [null, [Validators.required]],
        //Client_Type: [null, [Validators.required]],
        Client_Status: [null],
        Password: [null, [Validators.required, this.checkPassword]],
        Confirm_Password: ['', Validators.required],
      },
      {
        validator: MustMatch('Password', 'Confirm_Password'),
      }
    );
  }

  getCountries() {
    this.external.getCountries().subscribe((countries:any) => {
      console.log(countries);
      this.countries = countries.data;
    })
  }
  public checkPassword(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }
  getErrorPassword() {
    return this.formGroup.get('Password').hasError('required')
      ? ''
      : this.formGroup.get('Password').hasError('requirements')
      ? ''
      : '';
  }
  get f() {
    return this.formGroup.controls;
  }
  get g() {
    return this.formGroupOthers.controls;
  }

  getErrorEmail() {
    return this.formGroup.get('Email_Address').hasError('required')
      ? 'Field is required'
      : this.formGroup.get('Email_Address').hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }
  /// ProfilePicture
  selectFilePP(event) {
    this.selectedPPFiles = event.target.files;
    console.log(this.selectFilePP)
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result as string;
      };
    }
  }



    selectFile2(event) {
      this.selectedTFiles = event.target.files;
      }
      uploads() {
        const filePP = this.selectedPPFiles.item(0);
        this.currentPPUpload = new FileUpload(filePP);
        this.selectedPPFiles = undefined;
        //CV
          const file = this.selectedTFiles.item(0);
          this.selectedTFiles = undefined;
          this.currentCVUpload = new FileUpload(file);
          return
        }

}

