import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Result } from '../models/result.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Result[]> {
    return this.http.get<Result[]>(API_CONFIG.resultsService)
      .pipe(
        catchError(error => {
          console.error('Error al obtener resultados:', error);
          return of([]);
        })
      );
  }

  getById(id: number): Observable<Result | undefined> {
    return this.http.get<Result>(`${API_CONFIG.resultsService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener resultado:', error);
          return of(undefined);
        })
      );
  }

  getByPatientId(patientId: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${API_CONFIG.resultsService}/patient/${patientId}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener resultados del paciente:', error);
          return of([]);
        })
      );
  }

  create(resultData: Omit<Result, 'id'>): Observable<Result> {
    return this.http.post<Result>(API_CONFIG.resultsService, resultData)
      .pipe(
        catchError(error => {
          console.error('Error al crear resultado:', error);
          throw error;
        })
      );
  }

  update(id: number, result: Result): Observable<Result> {
    return this.http.put<Result>(`${API_CONFIG.resultsService}/${id}`, result)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar resultado:', error);
          throw error;
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.resultsService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar resultado:', error);
          throw error;
        })
      );
  }
}
