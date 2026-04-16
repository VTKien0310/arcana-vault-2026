import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon} from '@ionic/angular/standalone';
import {ItemEntity} from '@features/item/types/item.types';

@Component({
  selector: 'app-comp-view-video',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="video-viewer">
      <div class="video-placeholder">
        <ion-icon name="videocam" class="placeholder-icon"></ion-icon>
        <p class="placeholder-text">{{ item.name }}</p>
        <p class="placeholder-hint">Video player will be loaded here</p>
      </div>
    </div>
  `,
  styles: `
    .video-viewer {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .video-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 12px;
      border: 1px dashed var(--app-border-soft);
      border-radius: 12px;
      width: 100%;
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
export class ViewVideoComponent {
  @Input({required: true}) item!: ItemEntity;
}
