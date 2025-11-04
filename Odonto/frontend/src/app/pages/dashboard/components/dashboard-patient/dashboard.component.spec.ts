import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AuthService, User } from '../../../../services/auth.service';

// Mock do AuthService para os testes do painel do paciente
const mockAuthService = {
  getUser: () => ({ id: 10, nome: 'Paciente Teste', email: 'p@p.com', role: 'paciente' } as User),
};

describe('DashboardComponent (Patient)', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o nome do usuário no cabeçalho', () => {
    const welcomeMessage = compiled.querySelector('.header h1');
    expect(welcomeMessage?.textContent).toContain('Bem-vindo(a) de volta, Paciente Teste!');
  });

  it('deve carregar e ordenar as consultas futuras', () => {
    // A consulta de 2024-09-20 deve vir antes da de 2025-08-15
    expect(component.proximasConsultas.length).toBe(2);
    expect(component.proximasConsultas[0].servico).toBe('Clareamento');
    expect(component.proximasConsultas[1].servico).toBe('Manutenção de Aparelho');
  });

  it('deve carregar e ordenar o histórico de consultas', () => {
    // A consulta de 2024-07-05 deve ser a primeira do histórico (mais recente)
    expect(component.historicoConsultas.length).toBe(1);
    expect(component.historicoConsultas[0].servico).toBe('Ortodontia');
  });

  it('deve exibir a lista de próximas consultas no template', () => {
    const futureAppointments = compiled.querySelectorAll('.consultas-section .list-group-item');
    expect(futureAppointments.length).toBe(2);
    expect(futureAppointments[0].textContent).toContain('Clareamento');
    expect(futureAppointments[0].textContent).toContain('Próxima'); // Badge
  });

  it('deve exibir a tabela de histórico de consultas', () => {
    const historyRows = compiled.querySelectorAll('.history-section table tbody tr');
    expect(historyRows.length).toBe(1);
    expect(historyRows[0].textContent).toContain('Ortodontia');
  });

  it('deve mostrar mensagem quando não houver histórico', () => {
    component.historicoConsultas = [];
    fixture.detectChanges();
    expect(compiled.querySelector('#noHistory')?.textContent).toContain('Você ainda não possui um histórico de consultas.');
  });
});
