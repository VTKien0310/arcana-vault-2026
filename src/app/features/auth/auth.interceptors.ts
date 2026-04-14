import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {AuthRoutePath} from './auth.routes';
import {BackendApiErrorContent} from '@ports/backend/backend.types';
import {AppRoutePath} from '@app/app.routes';
import {ToastService} from '@features/master/services/toast.service';

export const unauthenticatedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      const responseContent = response.error.content as BackendApiErrorContent;

      if (
        response.status === 401
        && responseContent.error.code === 'unauthorized'
      ) {
        router.navigate([AppRoutePath.AUTH, AuthRoutePath.LOGIN]).then(() => {
          toast.error(responseContent.error.message).then();
        });
      }

      return throwError(() => response);
    }),
  );
};

export const secretJwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      const responseContent = response.error.content as BackendApiErrorContent;

      const secretJwtErrorCodes = [
        'missing_secret_jwt_header',
        'jwt_expired',
        'invalid_jwt',
      ];

      if (
        response.status === 401
        && secretJwtErrorCodes.includes(responseContent.error.code)
      ) {
        router.navigate([AppRoutePath.AUTH, AuthRoutePath.KEY]).then(() => {
          toast.error(responseContent.error.message).then();
        });
      }

      return throwError(() => response);
    }),
  );
};
