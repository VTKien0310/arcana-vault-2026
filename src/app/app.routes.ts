import { Routes } from '@angular/router';

export enum AppRoutePath {
  AUTH = 'auth',
  ITEMS = 'items',
}

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'items',
    loadChildren: () => import('./features/item/item.routes').then(m => m.routes)
  },
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full',
  }
];
