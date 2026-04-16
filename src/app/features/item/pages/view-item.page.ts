import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon, IonNote} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';
import {ViewItemService} from '@features/item/services/view-item.service';
import {UtilItemService} from '@features/item/services/util-item.service';
import {ItemType} from '@features/item/types/item.types';
import {ViewImageComponent} from '@features/item/components/view-image.component';
import {ViewVideoComponent} from '@features/item/components/view-video.component';
import {ViewDirectoryComponent} from '@features/item/components/view-directory.component';

@Component({
  selector: 'app-page-view-item',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    IonIcon,
    IonNote,
    ViewImageComponent,
    ViewVideoComponent,
    ViewDirectoryComponent,
  ],
  template: `
    <app-comp-page-layout>
      @if (viewItemService.viewItem$ | async; as vm) {
        <div class="page-content">
          <div class="item-header">
            <ion-icon
              [name]="utilItemService.getItemIcon(vm.item)"
              class="item-icon"
            ></ion-icon>
            <div class="item-info">
              <h1 class="item-name">{{ vm.item.name }}</h1>
              <div class="item-meta">
                @if (vm.item.size !== undefined) {
                  <span>{{ utilItemService.formatFileSize(vm.item.size) }}</span>
                }
                @if (vm.item.created_at) {
                  <ion-note class="item-date">
                    {{ vm.item.created_at | date:'medium' }}
                  </ion-note>
                }
              </div>
            </div>
          </div>

          <div class="item-viewer">
            @switch (vm.itemType) {
              @case (ItemType.IMAGE) {
                <app-comp-view-image [item]="vm.item"></app-comp-view-image>
              }
              @case (ItemType.VIDEO) {
                <app-comp-view-video [item]="vm.item"></app-comp-view-video>
              }
              @case (ItemType.DIRECTORY) {
                <app-comp-view-directory [item]="vm.item"></app-comp-view-directory>
              }
              @default {
                <div class="state-container">
                  <ion-icon name="close-circle" class="state-icon"></ion-icon>
                  <p class="state-text">Unsupported item type.</p>
                </div>
              }
            }
          </div>
        </div>
      } @else {
        <div class="state-container">
          <ion-icon name="close-circle" class="state-icon"></ion-icon>
          <p class="state-text">Item not loaded.</p>
        </div>
      }
    </app-comp-page-layout>
  `,
  styles: `
    .page-content {
      color: var(--ion-color-light);
    }

    .item-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    .item-icon {
      font-size: 40px;
      color: var(--ion-color-primary);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      color: var(--ion-color-light);
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 6px 0;
      word-break: break-word;
    }

    .item-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      color: var(--ion-color-medium);
      font-size: 13px;
    }

    .item-date {
      color: var(--ion-color-medium);
      font-size: 13px;
    }

    .item-viewer {
      margin-top: 8px;
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
  `,
})
export class ViewItemPage {
  viewItemService = inject(ViewItemService);
  utilItemService = inject(UtilItemService);

  ItemType = ItemType;
}
