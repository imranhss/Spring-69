import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';



/** Blocks unauthenticated users and redirects to /login */
export const authGuard: CanActivateFn = () => {
  
  const storage = inject(StorageService);
  const router  = inject(Router);

  if (storage.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};

/** Only allows the specified roles through */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const storage = inject(StorageService);
    const router  = inject(Router);
    const role    = storage.getRole();

    if (role && allowedRoles.includes(role)) return true;

    // Redirect to their own dashboard instead of a 403
    router.navigate(['/dashboard']);
    return false;
  };
};