import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraineesComponent } from './trainees/trainees.component';
import { TrainersComponent } from './trainers/trainers.component';
import { PractitionersComponent } from './practitioners/practitioners.component';
import { ClientsComponent } from './clients/clients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchAccessPipe } from './pipe';


@NgModule({
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
  ],
  declarations: [TraineesComponent,TrainersComponent,PractitionersComponent,ClientsComponent,SearchAccessPipe]
})
export class AccessModule {}
