import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BuscarPacienteComponent } from './buscar-paciente.component';

describe('BuscarPacienteComponent', () => {
  let component: BuscarPacienteComponent;
  let fixture: ComponentFixture<BuscarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarPacienteComponent, FormsModule, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all patients initially', () => {
    expect(component.filteredPatients.length).toBe(component.allPatients.length);
  });

  it('should filter patients by name', () => {
    component.searchTerm = 'Rafaela';
    component.filterPatients();
    expect(component.filteredPatients.length).toBe(1);
    expect(component.filteredPatients[0].nome).toBe('Rafaela Santos');
  });

  it('should filter patients by CPF', () => {
    component.searchTerm = '111.222.333-44';
    component.filterPatients();
    expect(component.filteredPatients.length).toBe(1);
    expect(component.filteredPatients[0].nome).toBe('Fernanda Lima');
  });

  it('should show all patients when search term is empty', () => {
    component.searchTerm = 'Rafaela';
    component.filterPatients();
    expect(component.filteredPatients.length).toBe(1);

    component.searchTerm = '';
    component.filterPatients();
    expect(component.filteredPatients.length).toBe(component.allPatients.length);
  });

  it('should show no results for a non-existent patient', () => {
    component.searchTerm = 'NonExistent Patient';
    component.filterPatients();
    expect(component.filteredPatients.length).toBe(0);
  });
});
