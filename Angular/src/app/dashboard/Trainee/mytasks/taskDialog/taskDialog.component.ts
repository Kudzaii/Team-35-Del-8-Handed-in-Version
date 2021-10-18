import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TraineeService } from '../../services/trainee.service';

@Component({
  selector: 'app-taskDialog',
  templateUrl: './taskDialog.component.html',
  styleUrls: ['./taskDialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  selectedFile: File;
  Task_Id: number;
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private traineeService: TraineeService,
    private formBuilder: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();

  }

  ngOnInit() {
    this.createForm()
    this.Task_Id = this.data.id;
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      Description: ['', Validators.required],
    });
  }

  onSubmitUpload() {
    let Task;
     Task = {Description: "null" ,Image: null, PDF: null ,TaskDocument_ID: null};
    if (this.data.taskType == 'Photo Upload') {
      Task = {Description: null ,Image: this.selectedFile, PDF: null,TaskDocument_ID: null};
    } else {
      Task = {Description: "null" ,Image: null, PDF: null ,TaskDocument_ID: null};

    }

    if (this.selectedFile != null) {
      this.traineeService
        .CompleteTask(Task, this.Task_Id)
        .subscribe((res) => {});
    }
  }

  onSubmit(task){

    console.log(task)
    this.traineeService
    .CompleteTask(task, this.Task_Id)
    .subscribe((res) => {});
  }


}
