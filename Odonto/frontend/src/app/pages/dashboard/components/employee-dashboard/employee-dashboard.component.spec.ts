import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeDashboard } from './employee-dashboard.component';
import { AuthService, User } from '../../../../services/auth.service';
import { of } from 'rxjs';

// Mock do AuthService
const mockAuthService = {
  // Usamos um método que pode ser espionado (spyOn) para controlar o retorno
  getUser: () => null as User | null, 
};

describe('EmployeeDashboard', () => {
  let component: EmployeeDashboard;
  let fixture: ComponentFixture<EmployeeDashboard>;
  let compiled: HTMLElement;

  // Função auxiliar para configurar o TestBed para um usuário específico
  async function setupTestBedForUser(user: User | null) {
    // Espionamos o método e definimos o valor que ele deve retornar
    spyOn(mockAuthService, 'getUser').and.returnValue(user);

    await TestBed.configureTestingModule({
      imports: [EmployeeDashboard, RouterTestingModule],
      providers: [
        // Dizemos ao Angular para usar nosso mock no lugar do AuthService real
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDashboard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  }

  it('should create', () => {
    setupTestBedForUser(null); // Teste de criação básico
    expect(component).toBeTruthy();
  });

  describe('quando o usuário é Dentista', () => {
    beforeEach(async () => {
      const dentistaUser: User = { id: 2, nome: 'Dentista Teste', email: 'd@d.com', role: 'dentista' };
      await setupTestBedForUser(dentistaUser);
    });

    it('deve mostrar o widget de Agenda do Dia', () => {
      expect(compiled.querySelector('h5:has(i.bi-calendar-day)')?.textContent).toContain('Agenda do Dia');
    });

    it('não deve mostrar o widget de Sala de Espera', () => {
      // Apenas atendentes veem a sala de espera
      expect(compiled.querySelector('h5:i.bi-people-fill')).toBeFalsy();
    });
  });

  describe('quando o usuário é Atendente', () => {
    beforeEach(async () => {
      const atendenteUser: User = { id: 3, nome: 'Atendente Teste', email: 'at@at.com', role: 'atendente' };
      await setupTestBedForUser(atendenteUser);
    });

    it('deve mostrar os widgets de Sala de Espera e Agenda do Dia', () => {
      expect(compiled.querySelector('h5:has(i.bi-people-fill)')?.textContent).toContain('Sala de Espera');
      expect(compiled.querySelector('h5:has(i.bi-calendar-day)')?.textContent).toContain('Agenda do Dia');
    });

    it('não deve mostrar widgets específicos de outros perfis (ex: admin)', () => {
      // Verifica se um widget de admin (Faturamento) não está presente
      expect(compiled.querySelector('h5:has(i.bi-cash-coin)')).toBeFalsy();
    });
  });
});
