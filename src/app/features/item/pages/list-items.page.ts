import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';
import {ListItemsService} from '@features/item/services/list-items.service';
import {UtilItemService} from '@features/item/services/util-item.service';
import {ItemEntity} from '@features/item/types/item.types';

@Component({
  selector: 'app-page-list-items',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
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
                <ion-item
                  class="item-row"
                  [button]="true"
                  (click)="onItemClick(item)"
                >
                  <ion-icon
                    [name]="utilItemService.getItemIcon(item)"
                    slot="start"
                    class="item-icon"
                  ></ion-icon>
                  <ion-label>
                    <h2 class="item-name">{{ item.name }}</h2>
                    @if (item.size !== undefined) {
                      <p class="item-meta">{{ utilItemService.formatFileSize(item.size) }}</p>
                    }
                  </ion-label>
                  @if (item.created_at) {
                    <ion-note slot="end" class="item-date">
                      {{ item.created_at | date:'medium' }}
                    </ion-note>
                  }
                </ion-item>
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

    .item-row {
      --background: var(--app-surface);
      --border-color: var(--app-border-soft);
      --border-radius: 10px;
      --padding-start: 14px;
      --inner-padding-end: 14px;
      margin-bottom: 8px;
      border-radius: 10px;
      border: 1px solid var(--app-border-soft);
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }

    .item-row:hover {
      --background: var(--app-surface-strong);
      border-color: var(--ion-color-primary);
    }

    .item-icon {
      font-size: 28px;
      color: var(--ion-color-primary);
      margin-right: 12px;
      flex-shrink: 0;
    }

    .item-name {
      color: var(--ion-color-light);
      font-weight: 500;
      font-size: 15px;
      margin: 0 0 2px 0;
    }

    .item-meta {
      color: var(--ion-color-medium);
      font-size: 13px;
      margin: 0;
    }

    .item-date {
      color: var(--ion-color-medium);
      font-size: 12px;
      white-space: nowrap;
    }
  `,
})
export class ListItemsPage implements OnInit{
  private router = inject(Router);

  listItemsService = inject(ListItemsService);
  utilItemService = inject(UtilItemService);

  async ngOnInit(): Promise<void> {
    await this.listItemsService.fetchItemsIfEmpty();
  }

  onItemClick(item: ItemEntity): void {
    this.router.navigate(['/items', item.id]);
  }
}
