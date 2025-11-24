import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles: string[]) => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    if (currentUser && allowedRoles.includes(currentUser.rol)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
