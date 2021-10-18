import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoleGuard } from '../auth/dashboard-role.guard';
import { ProfileComponent } from './Client/Profile/Profile.component';
import { ResetPasswordComponent } from '../auth/components/reset-password/reset-password.component';
import { TrialQuestionnaireComponent } from './Client/TrialQuestionnaire/TrialQuestionnaire.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
    children: [{ path: 'Dashboard', component: DashboardComponent }],
  },
  {path:'reset-password', component: ResetPasswordComponent},
  {path: 'Trial_Questionnaire', component: TrialQuestionnaireComponent},
  {path: 'Profile', component: ProfileComponent},
  {
    path: '',
    loadChildren: () =>
      import('./Admin/admin-routing.module').then((m) => m.AdminRoutingModule),
    canActivate: [DashboardRoleGuard],
    data: { roles: [1] },
  },
  {
    path: '',
    loadChildren: () =>
      import('./Client/client-routing.module').then(
        (m) => m.ClientRoutingModule
      ),
    canActivate: [DashboardRoleGuard],
    data: { roles: [2] }, //a sends this data to Auth guard
  },
  {
    path: '',
    loadChildren: () =>
      import('./Practitioner/practitioner-routing.module').then((m) => m.PractitionerRoutingModule),
    canActivate: [DashboardRoleGuard],
    data: { roles: [3] },
  },
  {
    path: '',
    loadChildren: () =>
      import('./Trainer/trainer-routing.module').then((m) => m.TrainerRoutingModule),
    canActivate: [DashboardRoleGuard],
    data: { roles: [4] },
  },
  {
    path: '',
    loadChildren: () =>
      import('./Trainee/trainee-routing.module').then((m) => m.TraineeRoutingModule),
    canActivate: [DashboardRoleGuard],
    data: { roles: [5] },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
