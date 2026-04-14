import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  secretJwtInterceptor,
  unauthenticatedInterceptor,
} from '@features/auth/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(
      withFetch(),
      withInterceptors([unauthenticatedInterceptor, secretJwtInterceptor])
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
};
