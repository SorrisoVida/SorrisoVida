import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  slides = [
    { image: 'assets/images/img-home.jpg', alt: 'Dentista atendendo paciente' },
    { image: 'assets/images/clinica.jpg', alt: 'clínica' }
  ];
}
