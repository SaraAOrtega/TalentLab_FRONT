import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;  
    }

    const fecha = new Date(value);
    
    if (isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }

    return null;
  };
}
