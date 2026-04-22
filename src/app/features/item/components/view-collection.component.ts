import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon, IonList, IonSpinner} from '@ionic/angular/standalone';
import {ItemEntity} from '@features/item/item.types';
import {ListItemsService} from '@features/item/services/list-items.service';
import {ItemRowComponent} from '@features/item/components/item-row.component';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-comp-view-collection',
  standalone: true,
  imports: [CommonModule, IonIcon, IonList, IonSpinner, ItemRowComponent],
  template: `
    <div class="directory-viewer">
      @if ((collectionItems$ | async); as collectionItems) {
        @if (collectionItems.length === 0) {
          <div class="state-container">
            <ion-icon name="folder-open" class="state-icon"></ion-icon>
            <p class="state-text">This collection is empty.</p>
          </div>
        } @else {
          <ion-list class="item-list">
            @for (collectionItem of collectionItems; track collectionItem.name) {
              <app-comp-item-row [item]="collectionItem" [collection]="item.name"></app-comp-item-row>
            }
          </ion-list>
        }
      } @else {
        <div class="state-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p class="state-text">Loading collection...</p>
        </div>
      }
    </div>
  `,
  styles: `
    .directory-viewer {
      width: 100%;
    }

    .item-list {
      background: transparent;
      padding: 0;
    }

    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 12px;
      border: 1px dashed var(--app-border-soft);
      border-radius: 12px;
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
export class ViewCollectionComponent implements OnInit {
  private listItemsService = inject(ListItemsService);

  @Input({required: true}) item!: ItemEntity;

  collectionItems$: Observable<ItemEntity[]> = of([]);

  async ngOnInit(): Promise<void> {
    this.collectionItems$ = await this.listItemsService.fetchItemsOfCollection(this.item.name);
  }
}
