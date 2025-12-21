import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${API_CONFIG.userService}/auth/login`, { email, password })
      .pipe(
        map(response => {
          if (response && response.id) {
            const user: User = response;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return of(false);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === role;
  }

  register(userData: Omit<User, 'id'>): Observable<boolean> {
    return this.http.post<User>(`${API_CONFIG.userService}/auth/register`, userData)
      .pipe(
        map(response => {
          return response && response.id !== undefined;
        }),
        catchError(error => {
          console.error('Error en registro:', error);
          return of(false);
        })
      );
  }

  updateProfile(updatedUser: User): Observable<boolean> {
    return this.http.put<User>(`${API_CONFIG.userService}/${updatedUser.id}`, updatedUser)
      .pipe(
        map(response => {
          if (response && this.currentUserSubject.value?.id === updatedUser.id) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
          return true;
        }),
        catchError(error => {
          console.error('Error al actualizar perfil:', error);
          return of(false);
        })
      );
  }

  resetPassword(email: string, newPassword: string): Observable<boolean> {
    return this.http.post<any>(`${API_CONFIG.userService}/auth/reset-password`, { email, newPassword })
      .pipe(
        map(() => true),
        catchError(error => {
          console.error('Error al resetear contraseña:', error);
          return of(false);
        })
      );
  }
}
