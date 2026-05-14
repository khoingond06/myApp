import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; 
  }

  router.navigate([APP_ROUTES.LOGIN]); 
  return false;
};
