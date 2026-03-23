import { Routes } from '@angular/router';

export enum AuthRoutePath {
  LOGIN = 'login'
}

export const routes: Routes = [
  {
    path: AuthRoutePath.LOGIN,
    loadComponent: () => import('./pages/login.page').then(c => c.LoginPage)
  }
];
