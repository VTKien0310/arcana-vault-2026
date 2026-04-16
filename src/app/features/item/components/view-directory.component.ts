import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon, IonList, IonItem, IonLabel} from '@ionic/angular/standalone';
import {ItemEntity} from '@features/item/types/item.types';

@Component({
  selector: 'app-comp-view-directory',
  standalone: true,
  imports: [CommonModule, IonIcon, IonList, IonItem, IonLabel],
  template: `
    <div class="directory-viewer">
      <div class="directory-placeholder">
        <ion-icon name="folder-open" class="placeholder-icon"></ion-icon>
        <p class="placeholder-text">{{ item.name }}</p>
        <p class="placeholder-hint">Directory contents will be loaded here</p>
      </div>
    </div>
  `,
  styles: `
    .directory-viewer {
      width: 100%;
    }

    .directory-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 12px;
      border: 1px dashed var(--app-border-soft);
      border-radius: 12px;
    }

    .placeholder-icon {
      font-size: 64px;
      color: var(--ion-color-primary);
      opacity: 0.5;
    }

    .placeholder-text {
      color: var(--ion-color-light);
      font-weight: 500;
      margin: 0;
    }

    .placeholder-hint {
      color: var(--ion-color-medium);
      font-size: 13px;
      margin: 0;
    }
  `,
})
export class ViewDirectoryComponent {
  @Input({required: true}) item!: ItemEntity;
}
