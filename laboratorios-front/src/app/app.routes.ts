import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },
  {
    path: 'recuperar-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/auth/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
        canActivate: [roleGuard(['ADMINISTRADOR'])]
      },
      {
        path: 'medico',
        loadComponent: () => import('./components/dashboard/medico-dashboard/medico-dashboard').then(m => m.MedicoDashboard),
        canActivate: [roleGuard(['MEDICO'])]
      }
    ]
  },
  {
    path: 'manage',
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/manage/users/users').then(m => m.Users),
        canActivate: [roleGuard(['ADMINISTRADOR'])]
      },
      {
        path: 'labs',
        loadComponent: () => import('./components/manage/labs/labs').then(m => m.Labs),
        canActivate: [roleGuard(['ADMINISTRADOR'])]
      },
      {
        path: 'results',
        loadComponent: () => import('./components/manage/results/results').then(m => m.Results),
        canActivate: [roleGuard(['ADMINISTRADOR', 'MEDICO'])]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
