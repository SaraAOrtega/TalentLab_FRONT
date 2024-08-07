import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = ''; 
  password: string = ''; 
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
  }

  login() {
    // Validamos que el usuario ingrese datos
    if (this.email == '' || this.password == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    // Creamos el body
    const user: LoginUser = {
      email: this.email,
      password: this.password
    };

    this.loading = true;
    this._authService.login(user).subscribe({
      next: (response) => {
        // El token y el username ya se guardan en el UserService
        this.router.navigate(['/proyectosList']);
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}