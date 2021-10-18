import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { PractitionerUserService } from '../services/PractitionerUser.service';
import { SendFeedbackDialogComponent } from './sendFeedbackDialog/sendFeedbackDialog.component';
import { Location } from '@angular/common'
@Component({
  selector: 'app-send-feedbacks',
  templateUrl: './send-feedbacks.component.html',
  styleUrls: ['./send-feedbacks.component.scss']
})
export class SendFeedbacksComponent implements OnInit {

  Tasks: any;

    constructor( private location: Location,public dialog: MatDialog,private practitionerService:PractitionerUserService, private authService:AuthService) {}

  ngOnInit() {
      this.getTasks();

  }

  getTasks(){
    let id = Number(this.authService.loginId)
    console.log(id)
    this.practitionerService.GetFeedbackTasks(id).subscribe(response=>{
      console.log(response)
      this.Tasks = response
    })
  }



  SendFeedBack(Tid,taskType?): void {
    let dialogRef = this.dialog.open(SendFeedbackDialogComponent, {
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
