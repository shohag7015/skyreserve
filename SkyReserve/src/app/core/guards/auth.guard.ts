import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }

  const state = inject(Router).routerState.snapshot;
  return router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
