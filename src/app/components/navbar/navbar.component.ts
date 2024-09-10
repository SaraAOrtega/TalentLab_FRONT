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
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  username$: Observable<string>;
  isNavbarCollapsed = true;
  private subscription: Subscription = new Subscription();

  constructor(private _authService: AuthService) {
    this.isLoggedIn$ = this._authService.isLoggedIn$.pipe(
      tap((isLoggedIn) =>
        console.log('Estado de inicio de sesión:', isLoggedIn)
      )
    );

    this.username$ = this._authService.username$.pipe(
      tap((username) =>
        console.log('Nombre de usuario en NavbarComponent:', username)
      ),
      map((username) => username || 'Invitado')
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.subscription.add(
            this.username$.subscribe((username) => {
              console.log('Nombre de usuario actualizado:', username);
            })
          );
        }
      })
    );
  }

  logOut(): void {
    this._authService.logout();
  }
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
