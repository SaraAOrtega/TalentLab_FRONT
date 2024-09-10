import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        documento: [
          '',
          [Validators.required, this.startsWithLetterValidator()],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {}

  startsWithLetterValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-Z]/.test(control.value);
      return valid ? null : { startsWithLetter: { value: control.value } };
    };
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastr.error(
        'Por favor, corrija los errores en el formulario',
        'Error de Formulario'
      );
      return;
    }

    this.loading = true;
    const user: User = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      documento: this.registerForm.value.documento,
      password: this.registerForm.value.password,
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(
          `El usuario ${user.username} fue registrado con éxito`,
          'Usuario registrado'
        );
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.errorService.msjError(e);
      },
    });
  }

  get username() {
    return this.registerForm.get('username')!;
  }
  get email() {
    return this.registerForm.get('email')!;
  }
  get documento() {
    return this.registerForm.get('documento')!;
  }
  get password() {
    return this.registerForm.get('password')!;
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }
}
