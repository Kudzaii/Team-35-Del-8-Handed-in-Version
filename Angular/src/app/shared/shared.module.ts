import { RouterModule } from '@angular/router';
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { Error404Component } from './components/error404/error404.component';
import { AuthlayoutComponent } from './layouts/authlayout/authlayout.component';
import { DashboardlayoutComponent } from './layouts/dashboardlayout/dashboardlayout.component';
import { MaterialModule } from './material/material.module';
import { PreLoaderComponent } from './components/pre-loader/pre-loader.component';
import { ProfileComponent } from '../dashboard/Client/Profile/Profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIdleModule } from '@ng-idle/core';
import { MatSliderModule } from '@angular/material/slider';
import { TimesetterComponent } from './layouts/dashboardlayout/Timesetter/Timesetter.component';
import { ClientAuditReportComponent } from './components/client-audit-report/client-audit-report.component';
import { AlertComponent } from './utils/modals/alert/alert.component';
import { ConfirmComponent } from './utils/modals/confirm/confirm.component';
import { ParentDialogModalComponent } from './utils/modals/parent-dialog/parent-dialog.component';
import { PromptComponent } from './utils/modals/prompt/prompt.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomErrorHandler } from './utils/modals/custom-error/custom-error-handler';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ResetPasswordComponent } from '../auth/components/reset-password/reset-password.component';
import { TimePipe } from './utils/time.pipe';
import {MatChipsModule} from '@angular/material/chips'
import { ExitWavierComponent } from './components/exit-wavier/exit-wavier.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewDocumentDialogComponent } from './components/ViewDocumentDialog/ViewDocumentDialog.component';
//import { MyDialogModalComponent } from './utils/modals/my-dialog-modal/my-dialog-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    Error404Component,
    AuthlayoutComponent,
    DashboardlayoutComponent,
    PreLoaderComponent,
    ProfileComponent,
    TimesetterComponent,
    ClientAuditReportComponent,
    ResetPasswordComponent,
    ExitWavierComponent,
    //Modals
    AlertComponent,
    ConfirmComponent,
    PromptComponent,
    ParentDialogModalComponent,
    TimePipe,
    ViewDocumentDialogComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot(),
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    NgIdleModule.forRoot(),
    MatSliderModule,
    FormsModule,
    MaterialModule,
    SimpleModalModule.forRoot({container: "modal-container"}),
    MatChipsModule,
    PdfViewerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    HeaderComponent,
    MaterialModule,
    FormsModule,
    PreLoaderComponent,
    ProfileComponent,
    MatSliderModule,
    ClientAuditReportComponent,
    SweetAlert2Module,
    TimePipe,
    MatChipsModule,
    PdfViewerModule,

  ],
  entryComponents: [
    TimesetterComponent,
    AlertComponent,
    ConfirmComponent,
    PromptComponent,
    ParentDialogModalComponent,
    ViewDocumentDialogComponent,
    //MyDialogModalComponent

  ],
  // providers: [{
  //   provide: ErrorHandler,
  //   useClass: CustomErrorHandler
  // }],


})
export class SharedModule {}
