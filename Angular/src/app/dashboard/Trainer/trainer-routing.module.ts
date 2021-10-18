import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { AssignTraineeTaskComponent } from './send-trainee-task/AssignTraineeTask/AssignTraineeTask.component';
import { SendTraineeTaskComponent } from './send-trainee-task/send-trainee-task.component';
import { SetAvailabilityComponent } from './set-availability/set-availability.component';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';

const routes: Routes = [
  // { path: 'Profile', component: ProfileComponent },
  { path: 'send-feedback', component: SendFeedbackComponent },
  { path: 'send-task-trainee', component: SendTraineeTaskComponent },
  {
    path: 'Assign-trainee-task/:id',
    component: AssignTraineeTaskComponent,
  },
  {
    path: 'set-practitioner-availability',
    component: SetAvailabilityComponent,
  },
  { path: 'trainer-profile', component: TrainerProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerRoutingModule {}
