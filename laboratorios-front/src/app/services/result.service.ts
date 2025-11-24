import { Injectable } from '@angular/core';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private results: Result[] = [
    {
      id: 1,
      patientId: 3,
      patientName: 'María González',
      labId: 1,
      labName: 'Laboratorio Central Santiago',
      testType: 'Hemograma Completo',
      result: 'Normal',
      date: '2025-01-15',
      notes: 'Todos los valores dentro del rango normal'
    },
    {
      id: 2,
      patientId: 3,
      patientName: 'María González',
      labId: 2,
      labName: 'Laboratorio Clínico Viña del Mar',
      testType: 'Perfil Lipídico',
      result: 'Colesterol elevado',
      date: '2025-01-10',
      notes: 'Se recomienda dieta y control en 3 meses'
    },
    {
      id: 3,
      patientId: 3,
      patientName: 'María González',
      labId: 1,
      labName: 'Laboratorio Central Santiago',
      testType: 'Glucosa en Ayunas',
      result: 'Normal - 95 mg/dL',
      date: '2025-01-20',
      notes: ''
    }
  ];

  getAll(): Result[] {
    return [...this.results];
  }

  getById(id: number): Result | undefined {
    return this.results.find(r => r.id === id);
  }

  getByPatientId(patientId: number): Result[] {
    return this.results.filter(r => r.patientId === patientId);
  }

  create(result: Omit<Result, 'id'>): Result {
    const newResult: Result = {
      ...result,
      id: Math.max(...this.results.map(r => r.id)) + 1
    };
    this.results.push(newResult);
    return newResult;
  }

  update(id: number, result: Result): boolean {
    const index = this.results.findIndex(r => r.id === id);
    if (index !== -1) {
      this.results[index] = { ...result, id };
      return true;
    }
    return false;
  }

  delete(id: number): boolean {
    const index = this.results.findIndex(r => r.id === id);
    if (index !== -1) {
      this.results.splice(index, 1);
      return true;
    }
    return false;
  }
}
