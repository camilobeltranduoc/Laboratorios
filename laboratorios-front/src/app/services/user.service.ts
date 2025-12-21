import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(API_CONFIG.userService)
      .pipe(
        catchError(error => {
          console.error('Error al obtener usuarios:', error);
          return of([]);
        })
      );
  }

  getById(id: number): Observable<User | undefined> {
    return this.http.get<User>(`${API_CONFIG.userService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener usuario:', error);
          return of(undefined);
        })
      );
  }

  create(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(API_CONFIG.userService, userData)
      .pipe(
        catchError(error => {
          console.error('Error al crear usuario:', error);
          throw error;
        })
      );
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_CONFIG.userService}/${id}`, user)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar usuario:', error);
          throw error;
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.userService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar usuario:', error);
          throw error;
        })
      );
  }
}
