import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PractitionerRequestsComponent } from './PractitionerRequests/PractitionerRequests.component';
import { TraineeRequestsComponent } from './TraineeRequests/TraineeRequests.component';
import { TrainerRequestsComponent } from './TrainerRequests/TrainerRequests.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PractitionerRequestsComponent,TraineeRequestsComponent,TrainerRequestsComponent]
})
export class ApplicationRequestsModule { }
