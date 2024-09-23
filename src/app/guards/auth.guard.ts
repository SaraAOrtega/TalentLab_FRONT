import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Permitir acceso
    } else {
      console.log('Token expirado o no autenticado, redirigiendo a login');
      this.router.navigate(['/login']); // Redirigir a la página de login
      return false; // Bloquear acceso
    }
  }
  
}
