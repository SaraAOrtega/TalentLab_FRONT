import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Por favor, corrija los errores en el formulario', 'Error de Formulario');
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/proyectosList']);
      },
      error: (e: HttpErrorResponse) => {
        this.handleLoginError(e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private handleLoginError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.toastr.error('Email o contraseña inválidos', 'Error de Login');
    } else if (error.status === 404) {
      this.toastr.error('Usuario no encontrado', 'Error de Login');
    } else {
      this.errorService.msjError(error);
    }
  }
}