import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './Access/Access.component';
/** Access components  */
import { ClientsComponent } from './Access/clients/clients.component';
import { PractitionersComponent } from './Access/practitioners/practitioners.component';
import { TraineesComponent } from './Access/trainees/trainees.component';
import { TrainersComponent } from './Access/trainers/trainers.component';
import { ApplicationRequestManagementComponent } from './application-request-management/application-request-management.component';
import { PractitionerRequestsComponent } from './application-request-management/PractitionerRequests/PractitionerRequests.component';
import { TraineeRequestsComponent } from './application-request-management/TraineeRequests/TraineeRequests.component';
import { TrainerRequestsComponent } from './application-request-management/TrainerRequests/TrainerRequests.component';
import { AssignQuestionnaireComponent } from './assign-questionnaire/assign-questionnaire.component';
/** type management  */
import { ClientManagementComponent } from './clients/client-management/client-management.component';
import { ViewClientSessionsComponent } from './clients/client-management/ViewClientSessions/ViewClientSessions.component';

/**Questionnaire */
import { QuestionnaireManagementComponent } from './questionnaire-management/questionnaire-mangement.component';
/**User Assignment  */
import { AssignComponent } from './assign-user/assign.component';
import { PractitionerToClientComponent } from './assign-user/practitioner-to-client/practitioner-to-client.component';
import { TrainerToTraineeComponent } from './assign-user/trainer-to-trainee/trainer-to-trainee.component';
import { ReportsComponent } from './Reports/Reports.component';
import { AdministrationsComponent } from './administrations/administrations.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { TitleDetailsComponent } from './questionnaire-management/TitleDetails/TitleDetails.component';
import { AssingedUsersComponent } from './assign-user/Assinged-users/Assinged-users.component';
import { ExitWaversComponent } from './Exit-wavers/Exit-wavers.component';

const routes: Routes = [
  {
    path: 'client-management',
    component: ClientManagementComponent,
    children: [],
  },
  {
    path: 'ViewClientSession/:id',
    component: ViewClientSessionsComponent,
  },
  {
    path: 'Exit-Wavers',
    component: ExitWaversComponent
  },
  {
    path: 'access',
    component: AccessComponent,
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'practitioners',
        component: PractitionersComponent,
      },
      {
        path: 'trainees',
        component: TraineesComponent,
      },
      {
        path: 'trainers',
        component: TrainersComponent,
      },
    ],
  },
  {
    path: 'application-requests',
    component: ApplicationRequestManagementComponent,
    children: [
      { path: '', redirectTo: 'practitioner-requests', pathMatch: 'full' },
      {
        path: 'practitioner-requests',
        component: PractitionerRequestsComponent,
      },
      {
        path: 'trainee-requests',
        component: TraineeRequestsComponent,
      },
      {
        path: 'trainer-requests',
        component: TrainerRequestsComponent,
      },
    ],
  },
  {
    path: 'questionnaire-management',
    component: QuestionnaireManagementComponent,
    children: [],
  },
  {
    path: 'questionnaire-management/:id',
    component: TitleDetailsComponent,
  },
  {
    path: 'assign-questionnaire',
    component: AssignQuestionnaireComponent,
  },
  {
    path: 'audit-trail',
    component: AuditTrailComponent,
  },
  {
    path: 'assign',
    component: AssignComponent,
    children: [
      { path: '', redirectTo: 'assigned-users', pathMatch: 'full' },
      {
        path: 'assigned-users',
        component: AssingedUsersComponent,
      },
      {
        path: 'practitioner-to-client',
        component: PractitionerToClientComponent,
      },
      {
        path: 'trainer-to-trainee',
        component: TrainerToTraineeComponent,
      },
    ],
  },
  {
    path: 'Reports',
    component: ReportsComponent,
    loadChildren: () =>
      import('./Reports/Reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'Administrations',
    component: AdministrationsComponent,
    loadChildren: () =>import('./administrations/administrations.module').then((m) => m.AdministrationsModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
