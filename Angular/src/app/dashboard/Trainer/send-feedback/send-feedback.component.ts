import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { TrainerService } from '../services/trainer.service';
import { SendTraineefeedbackComponent } from './sendTraineefeedback/sendTraineefeedback.component';
import { Location } from '@angular/common'
@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.scss']
})
export class SendFeedbackComponent implements OnInit {


  Tasks: any;

    constructor(private location: Location, public dialog: MatDialog,private trainerService:TrainerService, private authService:AuthService) {}

  ngOnInit() {
      this.getTasks();

  }

  getTasks(){
    let id = Number(this.authService.loginId)
    console.log(id)
    this.trainerService.GetFeedbackTasks(id).subscribe(response=>{
      console.log(response)
      this.Tasks = response
    })
  }



  SendFeedBack(Tid,taskType?): void {
    let dialogRef = this.dialog.open(SendTraineefeedbackComponent, {
      width: '500px',
      data: {
        id: Tid,
        taskType:taskType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
goBack(): void {
  this.location.back();
}
}


