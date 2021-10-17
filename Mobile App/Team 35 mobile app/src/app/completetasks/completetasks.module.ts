import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletetasksPageRoutingModule } from './completetasks-routing.module';

import { CompletetasksPage } from './completetasks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletetasksPageRoutingModule
  ],
  declarations: [CompletetasksPage]
})
export class CompletetasksPageModule {}
