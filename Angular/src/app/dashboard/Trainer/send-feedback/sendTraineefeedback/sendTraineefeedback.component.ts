import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TrainerService } from '../../services/trainer.service';


@Component({
  selector: 'app-sendTraineefeedback',
  templateUrl: './sendTraineefeedback.component.html',
  styleUrls: ['./sendTraineefeedback.component.scss']
})
export class SendTraineefeedbackComponent implements OnInit {

  Task_Id: number;
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SendTraineefeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private trainerService: TrainerService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit() {
    this.Task_Id = this.data.id;
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      feedback: ['', Validators.required],
    });
  }

  onSubmit(value: any) {
    console.log(value)
    this.trainerService
      .SendFeedback(this.Task_Id, value.feedback)
      .subscribe((res) => {
        this.snackBar.openSnackBar('Feedback successfully submitted');
        this.onNoClick();
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
