import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {BackendApiErrorContent} from '@ports/backend/backend.types';
import {ToastService} from './services/toast.service';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      if (response.status >= 500 && response.status < 600) {
        const responseContent = response.error?.content as BackendApiErrorContent | undefined;
        const message = responseContent?.error?.message ?? 'Internal server error';
        toast.error(message).then();
      }

      return throwError(() => response);
    }),
  );
};
