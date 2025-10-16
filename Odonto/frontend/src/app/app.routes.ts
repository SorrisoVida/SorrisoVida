import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';
import { ScheduleComponent } from './features/appointments/schedule/schedule.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'servicos', component: ServicesComponent },
  { path: 'contato', component: ContactComponent },
  { path: 'agendamento', component: ScheduleComponent },
  { path: '**', redirectTo: '' }
];
