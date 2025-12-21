import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LabService } from '../../../services/lab.service';
import { AuthService } from '../../../services/auth.service';
import { Lab } from '../../../models/lab.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-labs',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './labs.html',
  styleUrl: './labs.css',
})
export class Labs implements OnInit {
  labs: Lab[] = [];
  filteredLabs: Lab[] = [];
  currentUser: User | null = null;
  labForm: FormGroup;
  showModal: boolean = false;
  editingLab: Lab | null = null;
  searchTerm: string = '';

  constructor(
    private labService: LabService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.labForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLabs();
  }

  loadLabs(): void {
    this.labService.getAll().subscribe({
      next: (labs) => {
        this.labs = labs;
        this.filteredLabs = labs;
      },
      error: (err) => console.error('Error al cargar laboratorios:', err)
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.filteredLabs = this.labs.filter(lab =>
      lab.name.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.editingLab = null;
    this.labForm.reset();
    this.showModal = true;
  }

  openEditModal(lab: Lab): void {
    this.editingLab = lab;
    this.labForm.patchValue(lab);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingLab = null;
    this.labForm.reset();
  }

  onSubmit(): void {
    if (this.labForm.valid) {
      const labData: Lab = this.labForm.value;

      if (this.editingLab) {
        labData.id = this.editingLab.id;
        this.labService.update(labData.id, labData).subscribe({
          next: () => {
            this.loadLabs();
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar laboratorio:', err)
        });
      } else {
        this.labService.create(labData).subscribe({
          next: () => {
            this.loadLabs();
            this.closeModal();
          },
          error: (err) => console.error('Error al crear laboratorio:', err)
        });
      }
    }
  }

  deleteLab(id: number): void {
    if (confirm('¿Está seguro de eliminar este laboratorio?')) {
      this.labService.delete(id).subscribe({
        next: () => this.loadLabs(),
        error: (err) => console.error('Error al eliminar laboratorio:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get name() { return this.labForm.get('name'); }
}
