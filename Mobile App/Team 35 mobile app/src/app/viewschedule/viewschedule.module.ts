import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewschedulePageRoutingModule } from './viewschedule-routing.module';

import { ViewschedulePage } from './viewschedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewschedulePageRoutingModule
  ],
  declarations: [ViewschedulePage]
})
export class ViewschedulePageModule {}
