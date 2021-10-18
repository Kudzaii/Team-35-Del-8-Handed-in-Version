import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/dashboard/Admin/services/DataService.service';
import { PractitionerUserService } from 'src/app/dashboard/Practitioner/services/PractitionerUser.service';
import { Task } from 'src/app/models/Task';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TrainerService } from '../../services/trainer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-AssignTraineeTask',
  templateUrl: './AssignTraineeTask.component.html',
  styleUrls: ['./AssignTraineeTask.component.scss']
})
export class AssignTraineeTaskComponent implements OnInit ,OnDestroy{
    ClientID: any;
    message: string;
    subscription: Subscription;
    Tasks: Array<any>;
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
      private traineeService:TrainerService,
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
      this.traineeService.getTasks(this.ClientID).subscribe((res) => {
        console.log(res);

        this.Tasks =res;
        console.log(this.Tasks)
      });

    }
    getDate(date:any){
      this.Task.DueDate =  date.value;
    }

    Submit() {
        console.log(this.Task);
        this.traineeService.AssignTask(this.ClientID, this.Task).subscribe(res => {
          console.log(res);
          this.getTasksAssigned();
          this.snackbar.openSnackBar("Successfully Assigned tasks")
        })

    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    goBack(): void {
      this.location.back();
    }

  }