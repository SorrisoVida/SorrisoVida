import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ScheduleComponent } from './features/appointments/schedule/schedule.component';

export const routes: Routes = [
  // Rotas Principais (com cabeçalho)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      { path: 'servicos', component: ServicesComponent, canActivate: [AuthGuard] }, 
      { path: 'contato', component: ContactComponent }, 
      { path: 'schedule', component: ScheduleComponent , canActivate: [AuthGuard]  },
      { path: 'under-construction', loadComponent: () => import('./pages/under-construction/under-construction.component').then(m => m.UnderConstructionComponent) },
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
