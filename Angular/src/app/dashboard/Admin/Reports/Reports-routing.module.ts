import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageSalesReportComponent } from './package-sales-report/package-sales-report.component';
import { ClientAuditReportComponent } from './client-audit-report/client-audit-report.component';

import { ReportscardsComponent } from './Reportscards_landing/Reportscards.component';
import { InactiveUsersReportComponent } from './inactiveUsersReport/inactiveUsersReport.component';
import { RegisteredUserReportComponent } from './RegisteredUserReport/RegisteredUserReport.component';
import { TraineePerformanceReportComponent } from './TraineePerformanceReport/TraineePerformanceReport.component';

const routes: Routes = [
  {
    path: '',
    component: ReportscardsComponent,
    pathMatch: 'full',
    children: [{ path: 'report-area', component: ReportscardsComponent }],
  },
  {
    path: 'package-sales',
    component: PackageSalesReportComponent,
    //children: [],
  },
  {
    path: 'client-audit',
    component: ClientAuditReportComponent,
  },
  {
    path: 'inactive-users-report',
    component: InactiveUsersReportComponent,
  },
  {
    path: 'registered-users-report',
    component: RegisteredUserReportComponent
  },
  {
    path: 'trainee-performance',
    component: TraineePerformanceReportComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
