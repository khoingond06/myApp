import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response) => {
              authService.saveToken(response.data.accessToken, response.data.refreshToken);
              
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.data.accessToken}`
                }
              });
              return next(newReq);
            }),
            catchError((err) => {
              authService.logout();
              router.navigate([APP_ROUTES.LOGIN]);
              return throwError(() => err);
            })
          );
        } else {
          authService.logout();
          router.navigate([APP_ROUTES.LOGIN]);
        }
      }

      switch (error.status) {
        case 403:
          console.warn('403 Forbidden');
          break;
        case 500:
          console.error('500 Server Error');
          break;
      }

      return throwError(() => error);
    })
  );
};
