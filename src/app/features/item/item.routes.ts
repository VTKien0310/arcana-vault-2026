import {Routes} from '@angular/router';

export enum ItemRoutePath {
  LIST = '',
  UPLOAD = 'upload',
}

export const routes: Routes = [
  {
    path: ItemRoutePath.UPLOAD,
    loadComponent: () => import('./pages/upload-item.page').then(
      c => c.UploadItemPage,
    ),
  },
  {
    path: ItemRoutePath.LIST,
    loadComponent: () => import('./pages/list-items.page').then(
      c => c.ListItemsPage,
    ),
  },
];
