import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/components/dashboard-patient/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ScheduleComponent } from './features/appointments/schedule/schedule.component';
import { adminGuard } from './guards/admin.guard'; 
import { EmployeeDashboard } from './pages/dashboard/components/employee-dashboard/employee-dashboard.component';
import { DashboardRedirectComponent } from './pages/dashboard/components/dashboard-redirect/dashboard-redirect.component';
import { AdminDashboardComponent } from './pages/dashboard/components/admin-dashboard/admin-dashboard.component';
import { employeeGuard } from './guards/employee.guard';

export const routes: Routes = [
  // Rotas Principais (com cabeçalho)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'servicos', component: ServicesComponent, canActivate: [AuthGuard] }, 
      { path: 'contato', component: ContactComponent }, 
      { path: 'schedule', component: ScheduleComponent , canActivate: [AuthGuard]  },
      { path: 'under-construction', loadComponent: () => import('./pages/under-construction/under-construction.component').then(m => m.UnderConstructionComponent) },
      
      // Rotas do Dashboard (agrupadas para melhor organização)
      {
        path: 'dashboard',
        canActivate: [AuthGuard], // Guarda principal para todas as rotas de dashboard
        children: [
          // A rota vazia ativa o redirecionador quando o usuário acessa '/dashboard'
          { path: '', component: DashboardRedirectComponent, pathMatch: 'full' },
          { path: 'paciente', component: DashboardComponent }, // Acessado via /dashboard/paciente
          { path: 'funcionario', component: EmployeeDashboard, canActivate: [employeeGuard] }, // Acessado via /dashboard/funcionario
          { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] } // Acessado via /dashboard/admin
        ]
      },
    ]
  },
  // Rotas de Autenticação (sem cabeçalho)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  // Rota para páginas não encontradas
  { path: '**', redirectTo: 'home' },
];
