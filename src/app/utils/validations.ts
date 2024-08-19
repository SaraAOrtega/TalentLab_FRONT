import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dniPattern = /^[0-9]{8}[A-Z]$/;
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    if (!control.value.match(dniPattern)) {
      return { invalidFormat: true };
    }

    const number = parseInt(control.value.substring(0, 8), 10);
    const letter = control.value.charAt(8);
    const correctLetter = validLetters.charAt(number % 23);

    return letter === correctLetter ? null : { invalidDni: true };
  };
}

export function fechaValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;  // Let required validator handle empty fields
    }

    const fecha = new Date(value);
    
    if (isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }

    // Puedes agregar más validaciones aquí si lo deseas
    // Por ejemplo, comprobar si la fecha está en un rango específico

    return null;
  };
}
