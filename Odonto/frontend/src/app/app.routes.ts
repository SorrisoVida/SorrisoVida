import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
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
      { path: 'sobre-nos', component: AboutUsComponent },
      { path: 'contato', component: ContactComponent }, 
      { path: 'schedule', component: ScheduleComponent , canActivate: [AuthGuard]  },
      { path: 'my-appointments', loadComponent: () => import('./features/appointments/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent), canActivate: [AuthGuard] },
      { path: 'perfil', loadComponent: () => import('./pages/Profiles/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },

      // Rotas para ferramentas de funcionários (agora em páginas separadas)
      {
        path: 'employee', 
        canActivate: [employeeGuard], 
        children: [
          { path: 'gerenciar-fila', loadComponent: () => import('./features/employee-tools/manage-queue/manage-queue.component').then(m => m.ManageQueueComponent) },
          { path: 'confirmar-consultas', loadComponent: () => import('./features/employee-tools/confirm-appointments/confirm-appointments.component').then(m => m.ConfirmAppointmentsComponent) },
          { path: 'cadastrar-paciente', loadComponent: () => import('./features/employee-tools/register-patient/register-patient.component').then(m => m.RegisterPatientComponent) },
          { path: 'full-calendar', loadComponent: () => import('./pages/dashboard/components/employee-dashboard/components/full-schedule/full-schedule.component').then(m => m.FullScheduleComponent) },
          { path: 'buscar-paciente', loadComponent: () => import('./features/employee-tools/buscar-paciente/buscar-paciente.component').then(m => m.BuscarPacienteComponent) },
          { path: 'pending-charts', loadComponent: () => import('./features/employee-tools/pending-charts/pending-charts.component').then(m => m.PendingChartsComponent) },
          { path: 'prontuario/:id', loadComponent: () => import('./features/employee-tools/view-chart/view-chart.component').then(m => m.ViewChartComponent) },
          { path: 'preencher-prontuario/:id', loadComponent: () => import('./features/employee-tools/fill-chart/fill-chart.component').then(m => m.FillChartComponent) },

        ]
      },

      // Rotas para ferramentas de admin
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: 'gerenciar-usuarios', loadComponent: () => import('./features/admin-tools/manage-users/manage-users.component').then(m => m.ManageUsersComponent) },
          { path: 'reports', loadComponent: () => import('./features/admin-tools/reports/reports.component').then(m => m.ReportsComponent) },
          { path: 'approve-registrations', loadComponent: () => import('./features/admin-tools/approve-registrations/approve-registrations.component').then(m => m.ApproveRegistrationsComponent) },
          { path: 'editar-usuario/:id', loadComponent: () => import('./features/admin-tools/edit-user/edit-user.component').then(m => m.EditUserComponent) },
          { path: 'gerenciar-funcionarios', loadComponent: () => import('./features/admin-tools/manage-employees/manage-employees.component').then(m => m.ManageEmployeesComponent) },
          { path: 'controle-estoque', loadComponent: () => import('./features/admin-tools/inventory-control/inventory-control.component').then(m => m.InventoryControlComponent) },
        ]
      },

      // Rotas do Dashboard (agrupadas para melhor organização)
      {
        path: 'dashboard',
        canActivate: [AuthGuard], // Guarda principal para todas as rotas de dashboard
        children: [
          // A rota vazia ativa o redirecionador quando o usuário acessa '/dashboard'
          { path: '', component: DashboardRedirectComponent, pathMatch: 'full' },
          { path: 'paciente', component: DashboardComponent }, // Acessado via /dashboard/paciente
          { 
            path: 'funcionario', 
            component: EmployeeDashboard, 
            canActivate: [employeeGuard],
            // A propriedade 'children' foi removida daqui
          }, 
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
