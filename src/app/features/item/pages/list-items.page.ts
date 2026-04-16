import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  IonIcon,
  IonList,
  IonSpinner,
} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';
import {ItemRowComponent} from '@features/item/components/item-row.component';
import {ListItemsService} from '@features/item/services/list-items.service';

@Component({
  selector: 'app-page-list-items',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    IonList,
    IonSpinner,
    ItemRowComponent,
    IonIcon,
  ],
  template: `
    <app-comp-page-layout>
      <div class="page-content">
        @if ((listItemsService.items$ | async); as items) {
          @if (items.length === 0) {
            <div class="state-container">
              <ion-icon name="folder-open" class="state-icon"></ion-icon>
              <p class="state-text">No items yet. Upload something to get started.</p>
            </div>
          } @else {
            <ion-list class="item-list">
              @for (item of items; track item.id) {
                <app-comp-item-row [item]="item"></app-comp-item-row>
              }
            </ion-list>
          }
        } @else {
          <div class="state-container">
            <ion-spinner name="crescent"></ion-spinner>
            <p class="state-text">Loading items...</p>
          </div>
        }
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
      margin: 0 0 24px 0;
    }

    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      gap: 12px;
    }

    .state-icon {
      font-size: 48px;
      color: var(--ion-color-medium);
      opacity: 0.6;
    }

    .state-text {
      color: var(--ion-color-medium);
      margin: 0;
      text-align: center;
    }

    ion-spinner {
      width: 32px;
      height: 32px;
      color: var(--ion-color-primary);
    }

    .item-list {
      background: transparent;
      padding: 0;
    }
  `,
})
export class ListItemsPage implements OnInit{
  listItemsService = inject(ListItemsService);

  async ngOnInit(): Promise<void> {
    await this.listItemsService.fetchItemsIfEmpty();
  }
}
