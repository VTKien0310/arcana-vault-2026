import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import {ItemSortOption} from '@features/item/item.types';

@Component({
  selector: 'app-comp-sort-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonSelect,
    IonSelectOption,
  ],
  template: `
    <div class="sort-bar">
      <ion-icon name="swap-vertical" class="sort-icon"></ion-icon>
      <ion-select
        class="sort-select"
        [(ngModel)]="sortValue"
        (ionChange)="onSortChange($event)"
        interface="popover"
      >
        <ion-select-option value="name">A-Z</ion-select-option>
        <ion-select-option value="-name">Z-A</ion-select-option>
        <ion-select-option value="created_at">Oldest</ion-select-option>
        <ion-select-option value="-created_at">Newest</ion-select-option>
      </ion-select>
    </div>
  `,
  styles: `
    .sort-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      margin-bottom: 12px;
      background: var(--app-surface);
      border: 1px solid var(--app-border-soft);
      border-radius: 10px;
    }

    .sort-icon {
      font-size: 18px;
      color: var(--ion-color-primary);
      flex-shrink: 0;
    }

    .sort-select {
      --padding-start: 0;
      --padding-end: 0;
      color: var(--ion-color-light);
      font-size: 14px;
    }
  `,
})
export class SortSelectComponent {
  @Input() sortValue: ItemSortOption = 'name';
  @Output() sortChange = new EventEmitter<ItemSortOption>();

  onSortChange(event: CustomEvent): void {
    this.sortChange.emit(event.detail.value as ItemSortOption);
  }
}
