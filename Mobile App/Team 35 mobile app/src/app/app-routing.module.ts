import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'completetasks',
    loadChildren: () => import('./completetasks/completetasks.module').then( m => m.CompletetasksPageModule)
  },
  {
    path: 'viewschedule',
    loadChildren: () => import('./viewschedule/viewschedule.module').then( m => m.ViewschedulePageModule)
  },
  {
    path: 'viewtasks',
    loadChildren: () => import('./viewtasks/viewtasks.module').then( m => m.ViewtasksPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'viewschedule',
    loadChildren: () => import('./viewschedule/viewschedule.module').then( m => m.ViewschedulePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
