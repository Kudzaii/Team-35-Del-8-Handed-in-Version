import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrialQuestionnaireComponent } from '../Client/TrialQuestionnaire/TrialQuestionnaire.component';
import { BookingComponent } from './Booking/Booking.component';
import { MakeRegistrationFeeComponent } from './make-registration-fee/make-registration-fee.component';
import { ViewQuestionnaireComponent } from './myQuestionnaire/View-Questionnaire.component';
import { MySessionsComponent } from './MySessions/MySessions.component';
import { MytasksComponent } from './mytasks/mytasks.component';
import { PerformanceComponent } from './Performance/Performance.component';
import { TraineeProfileComponent } from './trainee-profile/trainee-profile.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {path: 'book', component: BookingComponent},
  {path: 'make-fee', component: MakeRegistrationFeeComponent},
  {path: 'sessions', component: MySessionsComponent},
  {path: 'performance', component: PerformanceComponent},
  {path: 'trainee-profile', component: TraineeProfileComponent},
  {path: 'upload-case-study', component: UploadComponent},
  {path: 'questionnaire', component: ViewQuestionnaireComponent},
  {path: 'trainee-tasks', component: MytasksComponent},
  {path: 'Trial_Questionnaire', component: TrialQuestionnaireComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraineeRoutingModule { }
