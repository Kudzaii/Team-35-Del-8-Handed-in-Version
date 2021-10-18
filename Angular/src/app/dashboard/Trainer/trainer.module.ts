import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRoutingModule } from './trainer-routing.module';
import { SetAvailabilityComponent } from './set-availability/set-availability.component';
import { SendTraineeTaskComponent } from './send-trainee-task/send-trainee-task.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendTraineefeedbackComponent } from './send-feedback/sendTraineefeedback/sendTraineefeedback.component';
import { AssignTraineeTaskComponent } from './send-trainee-task/AssignTraineeTask/AssignTraineeTask.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';




@NgModule({
  declarations: [SetAvailabilityComponent,SendTraineeTaskComponent,SendFeedbackComponent,SendTraineefeedbackComponent,
    AssignTraineeTaskComponent,TrainerProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
     FormsModule,
    RouterModule,
    TrainerRoutingModule
  ],
  entryComponents:[
    SendTraineefeedbackComponent
  ]
})
export class TrainerModule { }
