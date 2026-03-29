import { Routes } from '@angular/router';
import {
  unauthenticatedGuard
} from '@features/auth/guards/unauthenticated.guard';

export enum AuthRoutePath {
  LOGIN = 'login'
}

export const routes: Routes = [
  {
    path: AuthRoutePath.LOGIN,
    loadComponent: () => import('./pages/login.page').then(c => c.LoginPage),
    canActivate: [unauthenticatedGuard]
  }
];
