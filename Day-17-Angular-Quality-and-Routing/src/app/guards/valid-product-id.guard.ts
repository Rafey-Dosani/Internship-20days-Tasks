import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const validProductIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (id && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id))) {
    return true;
  }

  return router.createUrlTree(['/products'], {
    queryParams: { invalidId: id ?? '' },
  });
};
