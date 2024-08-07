import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { ErrorService } from '../../services/error.service';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']  // Changed from styleUrl to styleUrls
})
export class RegisterComponent implements OnInit {
  username: string = ''; 
  email : string = ''; 
  documento : string = ''; 
  password: string = ''; 
  confirmPassword: string = '';  // Corrected the typo in confirmPassword
  loading : boolean = false

  
  constructor(private toastr: ToastrService,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService) { }


  ngOnInit(): void {
    // Initialize any data or perform any setup here
  }

  addUser(): void {
    if (this.username === '' || this.email === '' || this.documento === ''|| this.password === '' || this.confirmPassword === '') {
      this.toastr.error ('Todos los cambios son obligatorios')
      return
      // Handle the case where any of the fields are empty
    } 

    if (this.password != this.confirmPassword){
      this.toastr.error ('las contaseñas no coinciden');
      return;
    }

    const user : User = {
      username: this.username,
      email: this.email,
      documento: this.documento,
      password : this.password
    }

    this.loading = true;
    this._authService.register(user).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(`El usuario ${this.username} fue registrado con exito`, 'Usuario registrado');
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }
}