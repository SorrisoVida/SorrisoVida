import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../services/auth.service';

@Component({
  selector: 'app-approve-registrations',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './approve-registrations.component.html',
  styleUrls: ['./approve-registrations.component.scss']
})
export class ApproveRegistrationsComponent implements OnInit {

  pendingUsers: Partial<User>[] = [];

  ngOnInit(): void {
    // Dados mockados para a lista de cadastros pendentes
    this.pendingUsers = [
      { id: 101, nome: 'Laura Mendes', email: 'laura.m@email.com', role: 'paciente' },
      { id: 102, nome: 'Dr. Ricardo Gomes', email: 'ricardo.g@clinica.com', role: 'dentista' },
    ];
  }

  approve(userId: number | undefined): void {
    if (!userId) return;
    console.log(`Aprovando usuário com ID: ${userId}`);
    // Lógica para aprovar o usuário (ex: chamada de API)
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
  }

  reject(userId: number | undefined): void {
    if (!userId) return;
    console.log(`Rejeitando usuário com ID: ${userId}`);
    // Lógica para rejeitar o usuário (ex: chamada de API)
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
  }
}