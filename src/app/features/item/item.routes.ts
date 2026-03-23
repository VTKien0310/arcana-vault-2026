import {Routes} from '@angular/router';

export enum ItemRoutePath {
  LIST = '',
}

export const routes: Routes = [
  {
    path: ItemRoutePath.LIST,
    loadComponent: () => import('./pages/list-items.page').then(
      c => c.ListItemsPage,
    ),
  },
];
