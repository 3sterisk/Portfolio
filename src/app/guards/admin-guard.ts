import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    take(1),
    map(isAdmin => {
      if (isAdmin) {
        return true;
      } else {
        return router.parseUrl('/');
      }
    })
  );
};
