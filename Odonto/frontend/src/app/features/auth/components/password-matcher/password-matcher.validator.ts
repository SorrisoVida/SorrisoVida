import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador customizado para um FormGroup que verifica se os campos 'password' e 'confirmPassword' são iguais.
 * @returns `ValidationErrors` com a chave `mismatch: true` se as senhas não conferem, caso contrário `null`.
 */
export const passwordMatcherValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Não faz nada se os controles não existirem ou se o campo de confirmação ainda não foi tocado
  if (!password || !confirmPassword || !confirmPassword.dirty) {
    return null;
  }

  // Retorna o erro se os valores forem diferentes
  return password.value === confirmPassword.value ? null : { mismatch: true };
};