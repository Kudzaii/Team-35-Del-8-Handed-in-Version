import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { now } from 'moment';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/dashboard/Admin/services/DataService.service';
import { ClientService } from 'src/app/dashboard/Client/services/client.service';
import { Task } from 'src/app/models/Task';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PractitionerUserService } from '../../services/PractitionerUser.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-AssignClientTask',
  templateUrl: './AssignClientTask.component.html',
  styleUrls: ['./AssignClientTask.component.scss'],
})
export class AssignClientTaskComponent implements OnInit, OnDestroy {
  ClientID: any;
  message: string;
  subscription: Subscription;
  Tasks: Array<Task>;
  dueDate:any;
  minDate = new Date();

  Task: Task = {
    Description: null,
    Feedback: null,
    StartDate: null,
    DueDate: null,
    Task_ID: null,
    Status:null
  };
  constructor(
    private Arouter: ActivatedRoute,
    private data: DataService,
    private sharedService:SharedService,
    private practitionerService:PractitionerUserService,
    private snackbar: SnackbarService,
    private location: Location
  ) {}

  ngOnInit() {

    this.subscription = this.data.currentMessage.subscribe(
      (message) => (this.message = message)
    );

      this.getTasksAssigned();
  }

  getTasksAssigned(){
    this.ClientID = Number(this.Arouter.snapshot.params.id);
    this.practitionerService.getTasks(this.ClientID).subscribe((res) => {
      console.log(res);

      this.Tasks =res;
      console.log(this.Tasks)
    });

  }
  getDate(date:any){
    this.Task.DueDate =  date.value;
  }

  Submit() {


    Swal.fire({
      title: 'Are You Sure You Want To Send This Task To Your Client?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.practitionerService.AssignTask(this.ClientID, this.Task).subscribe(res => {
          console.log(res);
          this.getTasksAssigned();
          this.snackbar.openSnackBar("Successfully Assigned Task")
        })
      }
      else {

      }
    })

      console.log(this.Task);


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}
