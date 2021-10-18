import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from 'src/app/dashboard/Client/services/client.service';
import Swal from 'sweetalert2';
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
    private clientService: ClientService,
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
      this.clientService
        .CompleteTask(Task, this.Task_Id)
        .subscribe((res) => {});
    }
  }

  onSubmit(task){
    Swal.fire({
      title: 'Are You sure You Want To Send This Task?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(task)
        this.clientService
        .CompleteTask(task, this.Task_Id)
        .subscribe((res) => {});
      }
      else {

      }
    })
    
  }


}
