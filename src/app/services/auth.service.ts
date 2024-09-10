import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { User, LoginUser } from '../interfaces/user';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  username: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private myAppUrl: string;
  private myApiUrl: string;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string>('');
  username$ = this.usernameSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(this.getUserId());
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users';
    this.checkToken();
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  login(user: LoginUser): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.myAppUrl}${this.myApiUrl}/login`, user)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId); // Guardar el ID del usuario
          this.isLoggedInSubject.next(true);
          this.usernameSubject.next(response.username);
          this.userIdSubject.next(response.userId);

          console.log(response.username);
          console.log(response.token);
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next('');
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private checkToken(): void {
    if (this.hasToken()) {
      const username = localStorage.getItem('username');
      this.isLoggedInSubject.next(true);
      if (username) {
        this.usernameSubject.next(username);
      }
    }
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
