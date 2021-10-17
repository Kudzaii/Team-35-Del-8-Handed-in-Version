import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewschedulePage } from './viewschedule.page';

const routes: Routes = [
  {
    path: '',
    component: ViewschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewschedulePageRoutingModule {}
