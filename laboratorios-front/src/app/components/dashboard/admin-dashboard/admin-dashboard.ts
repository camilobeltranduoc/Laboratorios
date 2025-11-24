import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { LabService } from '../../../services/lab.service';
import { ResultService } from '../../../services/result.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  currentUser: User | null = null;
  totalUsers: number = 0;
  totalLabs: number = 0;
  totalResults: number = 0;
  usersByRole: { [key: string]: number } = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private labService: LabService,
    private resultService: ResultService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStatistics();
  }

  loadStatistics(): void {
    const users = this.userService.getAll();
    this.totalUsers = users.length;

    this.usersByRole = {
      ADMINISTRADOR: users.filter(u => u.rol === 'ADMINISTRADOR').length,
      MEDICO: users.filter(u => u.rol === 'MEDICO').length,
      PACIENTE: users.filter(u => u.rol === 'PACIENTE').length,
      LABORATORISTA: users.filter(u => u.rol === 'LABORATORISTA').length
    };

    this.totalLabs = this.labService.getAll().length;
    this.totalResults = this.resultService.getAll().length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
