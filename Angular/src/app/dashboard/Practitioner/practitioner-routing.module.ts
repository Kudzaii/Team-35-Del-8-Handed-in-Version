import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../Client/Profile/Profile.component';
import { ClientRequestsComponent } from './client-requests/client-requests.component';
import { MySlotsComponent } from './my-slots/my-slots.component';
import { PractitionerProfileComponent  } from './PractitonerProfile/PractitonerProfile.component';
import { PurchaseQuestionnaireComponent } from './purchase-questionnaire/purchase-questionnaire.component';
import { AssignClientTaskComponent } from './send-client-task/AssignClientTask/AssignClientTask.component';
import { SendClientTaskComponent } from './send-client-task/send-client-task.component';
import { SendFeedbacksComponent } from './send-feedbacks/send-feedbacks.component';
import { SetAvailabilityComponent } from './set-availability/set-availability.component';

const routes: Routes = [
  { path: 'Profile-Practitioner', component: PractitionerProfileComponent },
  { path: 'client-requests', component: ClientRequestsComponent },
  { path: 'purchase-questionnaire', component: PurchaseQuestionnaireComponent },
  { path: 'set-availability', component: SetAvailabilityComponent },
  { path: 'send-client-task', component: SendClientTaskComponent },
  { path: 'feedbacks', component: SendFeedbacksComponent },
  {path:'my-slots', component:MySlotsComponent},
  {
    path: 'Assign-client-task/:id',
    component: AssignClientTaskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PractitionerRoutingModule {}
