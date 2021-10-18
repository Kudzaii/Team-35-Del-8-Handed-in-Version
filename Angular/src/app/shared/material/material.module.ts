import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,    MatIconModule,MatCardModule,MatInputModule,
    MatButtonModule,MatFormFieldModule,MatSelectModule,
    MatStepperModule,MatProgressBarModule,MatDialogModule,
    MatChipsModule,MatDatepickerModule,MatNativeDateModule,
    MatRadioModule,MatSlideToggleModule,MatExpansionModule,
    MatInputModule
  ],
  exports:[
    MatTabsModule, MatIconModule,MatCardModule,MatInputModule,
    MatButtonModule,MatFormFieldModule,MatSelectModule,
    MatStepperModule,MatProgressBarModule,MatDialogModule,
    MatChipsModule,MatDatepickerModule,MatNativeDateModule,
    MatRadioModule,MatSlideToggleModule,MatExpansionModule,


  ],
  declarations: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class MaterialModule { }
