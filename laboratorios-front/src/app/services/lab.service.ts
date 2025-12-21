import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Lab } from '../models/lab.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lab[]> {
    return this.http.get<Lab[]>(API_CONFIG.labsService)
      .pipe(
        catchError(error => {
          console.error('Error al obtener laboratorios:', error);
          return of([]);
        })
      );
  }

  getById(id: number): Observable<Lab | undefined> {
    return this.http.get<Lab>(`${API_CONFIG.labsService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener laboratorio:', error);
          return of(undefined);
        })
      );
  }

  create(labData: Omit<Lab, 'id'>): Observable<Lab> {
    return this.http.post<Lab>(API_CONFIG.labsService, labData)
      .pipe(
        catchError(error => {
          console.error('Error al crear laboratorio:', error);
          throw error;
        })
      );
  }

  update(id: number, lab: Lab): Observable<Lab> {
    return this.http.put<Lab>(`${API_CONFIG.labsService}/${id}`, lab)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar laboratorio:', error);
          throw error;
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.labsService}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar laboratorio:', error);
          throw error;
        })
      );
  }
}
