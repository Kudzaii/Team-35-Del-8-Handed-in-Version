import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientTypeComponent } from './ClientType/ClientType.component';
import { PackageTypeComponent } from './PackageType/PackageType.component';
import { QuestionnaireTypeComponent } from './QuestionnaireType/QuestionnaireType.component';
import { Types_landingComponent } from './Types_landing/Types_landing.component';


const routes: Routes = [
  {
    path: '',
    component: Types_landingComponent,
    pathMatch: 'full',
    children: [{ path: 'types-area', component: Types_landingComponent }],
  },
 { path: 'client-type', component: ClientTypeComponent},
 { path: 'package-type', component: PackageTypeComponent},
 { path: 'questionnaire-type', component: QuestionnaireTypeComponent},

]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminsRoutingModule { }
