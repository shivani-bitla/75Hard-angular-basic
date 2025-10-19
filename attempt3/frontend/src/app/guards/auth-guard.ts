import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthService);
  const router = inject (Router);
    return authService.authState$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }else{
          return false;
        }
      })
      
    )
};
