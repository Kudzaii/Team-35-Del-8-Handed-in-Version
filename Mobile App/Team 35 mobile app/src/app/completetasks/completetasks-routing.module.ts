import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletetasksPage } from './completetasks.page';

const routes: Routes = [
  {
    path: '',
    component: CompletetasksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletetasksPageRoutingModule {}
