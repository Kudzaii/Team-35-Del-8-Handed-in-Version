import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { TraineesService } from 'src/app/dashboard/Admin/services/trainees.service';
import { TrainerService } from 'src/app/dashboard/Admin/services/trainer.service';
import { ClientService } from 'src/app/dashboard/Client/services/client.service';
import { PractitionerUserService } from 'src/app/dashboard/Practitioner/services/PractitionerUser.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ConfirmUpdateDialog',
  templateUrl: './ConfirmUpdateDialog.component.html',
  styleUrls: ['./ConfirmUpdateDialog.component.scss'],
})
export class ConfirmUpdateDialogComponent implements OnInit {
  Spinner = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService,
    private trainerService: TrainerService,
    private traineeService: TraineesService,
    private practitionerService: PractitionerUserService,

    private AuthServe: AuthService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  Update() {
    this.Spinner = true;

    if (this.data.role === 2) {
      this.clientService.UpdateClient(this.data.clientN).subscribe(() => {
        this.dialogRef.close();
        this.success();
      });
    } else if (this.data.role === 3) {
      //!practitoner
      this.practitionerService.MaintainPractitioner(this.data.clientN).subscribe(res => {
        console.log(res)
        this.dialogRef.close();
        this.success();

      });
    } else if (this.data.role === 4) {
      //!Trainer
      this.trainerService.MaintainTrainer(this.data.clientN).subscribe(() => {
        this.dialogRef.close();
        this.success();

      });
    } else if (this.data.role === 5) {
      this.data.clientN.Trainee_ID = Number(this.AuthServe.loginId)
      //!Trainee
      this.traineeService.MaintainTrainee(this.data.clientN).subscribe(() => {
        this.dialogRef.close();
        this.success();
      });
    }
  }

  success() {
    swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Successfully updated, profile!',
      showConfirmButton: false,
      timer: 1500
    })
  }

}
