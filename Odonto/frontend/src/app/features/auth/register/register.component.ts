import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { passwordMatcherValidator } from '../components/password-matcher/password-matcher.validator';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: passwordMatcherValidator }
      ),
      terms: [false, Validators.requiredTrue]
    });
  }

  // Getters para facilitar o acesso no template
  get fullName() { return this.registerForm.get('fullName'); }
  get cpf() { return this.registerForm.get('cpf'); }
  get phone() { return this.registerForm.get('phone'); }
  get email() { return this.registerForm.get('email'); }
  get passwordGroup() { return this.registerForm.get('passwordGroup'); }
  get password() { return this.registerForm.get('passwordGroup.password'); }
  get confirmPassword() { return this.registerForm.get('passwordGroup.confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulário enviado:', this.registerForm.value);
      alert('Cadastro realizado com sucesso!');
      this.registerForm.reset();
    } else {
      console.log('Formulário inválido. Verifique os campos.');
      this.registerForm.markAllAsTouched();
    }
  }
}