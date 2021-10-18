import { DashboardlayoutComponent } from './shared/layouts/dashboardlayout/dashboardlayout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { Error404Component } from './shared/components/error404/error404.component';
import { HomeGuard } from './auth/components/landing-page/home.guard';
import { LandingPageComponent } from './auth/components/landing-page/landing-page.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'Welcome',
    pathMatch: 'full',

  },
  //Dash Route
  {
    path: 'dashboard',
    component: DashboardlayoutComponent  ,
   canActivate:[AuthGuard],
   loadChildren: () => import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
    //Dash Route
    {path: 'Welcome', component: LandingPageComponent, canActivate:[HomeGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'register/:ApplicationTypeId', component: RegisterComponent},
    {path:'forgot-password', component: ForgotPasswordComponent},
    {
      path: "**",
      component:Error404Component
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
