import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return control.value.length >= min ? null : { minLength: { requiredLength: min, actualLength: control.value.length } };
    };
  }

  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return control.value.length <= max ? null : { maxLength: { requiredLength: max, actualLength: control.value.length } };
    };
  }

  static hasSpecialChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
      return hasSpecialChar ? null : { hasSpecialChar: true };
    };
  }

  static hasNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasNumber = /\d/.test(control.value);
      return hasNumber ? null : { hasNumber: true };
    };
  }

  static hasUpperCase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(control.value);
      return hasUpperCase ? null : { hasUpperCase: true };
    };
  }

  static hasLowerCase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasLowerCase = /[a-z]/.test(control.value);
      return hasLowerCase ? null : { hasLowerCase: true };
    };
  }
}
