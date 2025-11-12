import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationService } from '../../../services/navigation.service';

interface Employee {
  id: number;
  nome: string;
  email: string;
  role: 'dentista' | 'atendente';
  dataAdmissao: string;
  salario: number;
  status: 'ativo' | 'inativo';
}

@Component({
  selector: 'app-manage-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss']
})
export class ManageEmployeesComponent implements OnInit {
  public navigationService = inject(NavigationService);
  private fb = inject(FormBuilder);

  employeeForm!: FormGroup;

  employees: Employee[] = [
    { id: 3, nome: 'Dra. Ana Paula', email: 'dentista@local.test', role: 'dentista', dataAdmissao: '2023-01-15', salario: 8500, status: 'ativo' },
    { id: 4, nome: 'Gabriel Duvall', email: 'atendente@local.test', role: 'atendente', dataAdmissao: '2022-08-01', salario: 2800, status: 'ativo' },
    { id: 6, nome: 'Dr. Carlos Souza', email: 'dentista2@local.test', role: 'dentista', dataAdmissao: '2024-03-20', salario: 8500, status: 'ativo' },
  ];

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      salario: [null, [Validators.required, Validators.min(1)]],
      dataAdmissao: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }
    // Lógica para adicionar o novo funcionário (mock)
    const newEmployee: Employee = {
      id: Math.floor(Math.random() * 1000),
      ...this.employeeForm.value,
      status: 'ativo'
    };
    this.employees.push(newEmployee);
    this.employeeForm.reset();
    alert('Funcionário adicionado com sucesso!');
  }
}