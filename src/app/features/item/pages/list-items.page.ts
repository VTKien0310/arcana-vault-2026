import {Component} from '@angular/core';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';

/**
 * Page for listing all user items (files, documents, media).
 */
@Component({
  selector: 'app-page-list-items',
  standalone: true,
  imports: [PageLayoutComponent],
  template: `
    <app-comp-page-layout>
      <div class="page-content">
        <h1>My Items</h1>
        <p>Your files and documents will appear here.</p>
      </div>
    </app-comp-page-layout>
  `,
  styles: `
    .page-content {
      color: var(--ion-color-light);
    }

    h1 {
      color: var(--ion-color-primary);
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }

    p {
      color: var(--ion-color-medium);
      margin: 0;
    }
  `
})
export class ListItemsPage {}
