import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  slides = [
    { image: 'assets/images/img-home.jpg', alt: 'Dentista atendendo paciente' },
    { image: 'assets/images/clinica.jpg', alt: 'clínica' }
  ];

  // desenvolvimento: botão de simulação removido — use fluxo real de login
}
