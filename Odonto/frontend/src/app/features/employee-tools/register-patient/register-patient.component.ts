import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.scss'
})
export class RegisterPatientComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cep: [''],
      logradouro: [''],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    console.log('Dados do formulário:', this.registerForm.value);

    setTimeout(() => {
      // Simulação de sucesso
      try {
        this.successMessage = 'Paciente cadastrado com sucesso!';
        this.registerForm.reset();
        this.isSubmitting = false;
      } catch (error) {
        this.errorMessage = 'Ocorreu um erro ao cadastrar o paciente. Tente novamente.';
        this.isSubmitting = false;
      }
    }, 2000);
  }
}