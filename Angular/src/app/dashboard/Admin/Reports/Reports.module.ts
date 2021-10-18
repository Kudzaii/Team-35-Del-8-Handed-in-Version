import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './Reports.component';
import { ReportsRoutingModule } from './Reports-routing.module';
import { PackageSalesReportComponent } from './package-sales-report/package-sales-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportscardsComponent } from './Reportscards_landing/Reportscards.component';
import { RouterModule } from '@angular/router';
import { ClientAuditReportComponent } from './client-audit-report/client-audit-report.component';
import { InactiveUsersReportComponent } from './inactiveUsersReport/inactiveUsersReport.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { RegisteredUserReportComponent } from './RegisteredUserReport/RegisteredUserReport.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TraineePerformanceReportComponent } from './TraineePerformanceReport/TraineePerformanceReport.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgxChartsModule,
  ],
  declarations: [
    ReportsComponent,
    PackageSalesReportComponent,
    ReportscardsComponent,
    ClientAuditReportComponent,
    InactiveUsersReportComponent,
    RegisteredUserReportComponent,
    TraineePerformanceReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportsModule {}
