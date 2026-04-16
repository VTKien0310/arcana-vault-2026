import {Routes} from '@angular/router';
import {authenticatedGuard} from '@features/auth/auth.guards';

export enum ItemRoutePath {
  LIST = '',
  UPLOAD = 'upload',
  VIEW = 'view',
}

export const routes: Routes = [
  {
    path: ItemRoutePath.UPLOAD,
    loadComponent: () => import('./pages/upload-item.page').then(
      c => c.UploadItemPage,
    ),
    canActivate: [authenticatedGuard]
  },
  {
    path: ItemRoutePath.VIEW,
    loadComponent: () => import('./pages/view-item.page').then(
      c => c.ViewItemPage,
    ),
    canActivate: [authenticatedGuard]
  },
  {
    path: ItemRoutePath.LIST,
    loadComponent: () => import('./pages/list-items.page').then(
      c => c.ListItemsPage,
    ),
    canActivate: [authenticatedGuard]
  },
];
