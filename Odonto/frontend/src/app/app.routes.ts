import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ScheduleComponent } from './features/appointments/schedule/schedule.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'servicos', component: ServicesComponent },
  { path: 'contato', component: ContactComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'agendamento', component: ScheduleComponent },
  { path: '**', redirectTo: '' }
];
