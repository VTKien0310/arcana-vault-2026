import { Routes } from '@angular/router';
import {
  unauthenticatedGuard
} from '@features/auth/auth.guards';

export enum AuthRoutePath {
  LOGIN = 'login',
  KEY = 'key'
}

export const routes: Routes = [
  {
    path: AuthRoutePath.LOGIN,
    loadComponent: () => import('./pages/login.page').then(c => c.LoginPage),
    canActivate: [unauthenticatedGuard]
  },
  {
    path: AuthRoutePath.KEY,
    loadComponent: () => import('./pages/key.page').then(c => c.KeyPage)
  }
];
