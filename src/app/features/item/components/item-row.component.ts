import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import {ItemEntity} from '@features/item/item.types';
import {UtilItemService} from '@features/item/services/util-item.service';
import {ViewItemService} from '@features/item/services/view-item.service';
import {AppRoutePath} from '@app/app.routes';
import {ItemRoutePath} from '@features/item/item.routes';

@Component({
  selector: 'app-comp-item-row',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
  ],
  template: `
    <ion-item
      class="item-row"
      [button]="true"
      (click)="onItemClick()"
    >
      <ion-icon
        [name]="utilItemService.getItemIcon(item)"
        slot="start"
        class="item-icon"
      ></ion-icon>
      <ion-label>
        <h2 class="item-name">{{ item.name }}</h2>
        <p class="item-meta">{{ utilItemService.formatFileSize(item.size) }}</p>
      </ion-label>
      @if (item.created_at) {
        <ion-note slot="end" class="item-date">
          {{ item.created_at | date:'medium' }}
        </ion-note>
      }
    </ion-item>
  `,
  styles: `
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
export class ItemRowComponent {
  private router = inject(Router);
  private viewItemService = inject(ViewItemService);

  utilItemService = inject(UtilItemService);

  @Input({required: true}) item!: ItemEntity;
  @Input() collection: string = '';

  onItemClick(): void {
    this.viewItemService.setItem(this.item);
    this.viewItemService.setCollection(this.collection);
    this.router.navigate([AppRoutePath.ITEMS, ItemRoutePath.VIEW]).then();
  }
}
