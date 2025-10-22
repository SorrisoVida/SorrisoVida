import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  slides = [
    { image: 'assets/images/img-home.jpg', alt: 'Dentista atendendo paciente' },
    { image: 'assets/images/clinica.jpg', alt: 'clínica' }
  ];

  // Método para o botão de desenvolvimento
  simularLogin(): void {
    this.authService.simulateLogin();
  }
}
