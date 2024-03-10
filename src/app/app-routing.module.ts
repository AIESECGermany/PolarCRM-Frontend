import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InternalLayoutComponent } from './internal-layout/internal-layout.component';
import { localGuard } from './local.guard';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { PerformanceManagementDetailsComponent } from './performance-management-details/performance-management-details.component';
import { PerformanceManagementComponent } from './performance-management/performance-management.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';

const routes: Routes = [
  {
    path: 'app',
    component: InternalLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [localGuard]
      },
      {
        path: 'recruitment',
        component: RecruitmentComponent,
        canActivate: [localGuard]
      },
      {
        path: 'members',
        component: MembersComponent,
        canActivate: [localGuard]
      },
      {
        path: 'performance-management',
        component: PerformanceManagementComponent,
        canActivate: [localGuard],
        children: [
          {
            path: ':id',
            component: PerformanceManagementDetailsComponent,
            outlet: 'member'
          }
        ]
      },
      {
        path: '**', redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**', redirectTo: 'login'
  }
];

const options = {
  enableTracing: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, options)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
