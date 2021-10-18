import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitWavierComponent } from 'src/app/shared/components/exit-wavier/exit-wavier.component';
import { BookingComponent } from './Booking/Booking.component';
import { ClientAuditReportComponent } from './clientAuditReport/clientAuditReport.component';
import { MyPackagesComponent } from './MyPackages/MyPackages.component';
import { MyQuestionnairesComponent } from './myQuestionnaires/myQuestionnaires.component';
import { MySessionsComponent } from './MySessions/MySessions.component';
import { MytasksComponent } from './Mytasks/Mytasks.component';
import { ProfileComponent } from './Profile/Profile.component';
import { ProgressReportComponent } from './ProgressReport/ProgressReport.component';
import { PurchasePackagesComponent } from './PurchasePackages/PurchasePackages.component';
import { TrialQuestionnaireComponent } from './TrialQuestionnaire/TrialQuestionnaire.component';

const routes: Routes = [
  //clients
  {path: 'My_Questionnaires', component: MyQuestionnairesComponent},
  {path: 'Sessions', component: MySessionsComponent},
  {path: 'tasks', component: MytasksComponent},
  {path: 'Profile', component: ProfileComponent},
  {path: 'PurchasePackage', component: PurchasePackagesComponent},
  {path:  'ProgressReport', component:ProgressReportComponent},
  {path: 'Booking',component:BookingComponent},
  {path: 'Client_Audit_Report', component: ClientAuditReportComponent},
  {path: 'Exit-wavier', component: ExitWavierComponent},

  {path: 'MyPackages',component:MyPackagesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
