import {CanActivateFn, RedirectCommand, Router} from '@angular/router';
import {inject} from '@angular/core';
import {
  AuthenticationService
} from '@features/auth/services/authentication.service';
import {AppRoutePath} from '@app/app.routes';

export const unauthenticatedGuard: CanActivateFn = async (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const isUnauthenticated = await authenticationService.getSession() === null;

  if (isUnauthenticated) {
    return true;
  }

  return new RedirectCommand(router.createUrlTree([AppRoutePath.ITEMS]));
};
