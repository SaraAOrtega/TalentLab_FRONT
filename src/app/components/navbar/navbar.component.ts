import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  username$: Observable<string>;
  private subscription: Subscription = new Subscription();

  constructor(private _authService: AuthService) {
    this.isLoggedIn$ = this._authService.isLoggedIn$.pipe(
      tap(isLoggedIn => console.log('Estado de inicio de sesión:', isLoggedIn))
    );

    this.username$ = this._authService.username$.pipe(
      tap(username => console.log('Nombre de usuario en NavbarComponent:', username)),
      map(username => username || 'Invitado') // Proporciona un valor por defecto si username es undefined
    );
  }

  ngOnInit(): void {
    // Suscribirse a los cambios de isLoggedIn y username
    this.subscription.add(
      this.isLoggedIn$.subscribe(isLoggedIn => {
        console.log('Cambio en estado de inicio de sesión:', isLoggedIn);
        if (isLoggedIn) {
          this.subscription.add(
            this.username$.subscribe(username => {
              console.log('Nombre de usuario actualizado:', username);
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Limpieza de suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }

  logOut(): void {
    this._authService.logout();
    console.log('Logout realizado');
  }
}