import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssingedUsersComponent } from './Assinged-users/Assinged-users.component';
import { PractitionerToClientComponent } from './practitioner-to-client/practitioner-to-client.component';
import { TrainerToTraineeComponent } from './trainer-to-trainee/trainer-to-trainee.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AssingedUsersComponent,PractitionerToClientComponent,TrainerToTraineeComponent]
})
export class assignModule { }
