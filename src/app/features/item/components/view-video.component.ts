import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon, IonSpinner} from '@ionic/angular/standalone';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '@features/item/types/item.types';
import {ViewItemService} from '@features/item/services/view-item.service';

@Component({
  selector: 'app-comp-view-video',
  standalone: true,
  imports: [CommonModule, IonSpinner],
  template: `
    <div class="video-viewer">
      @if ((videoUrl$ | async); as videoUrl) {
        <video
          controls
          [src]="videoUrl"
          class="video-element"
        >
          Your browser does not support the video tag.
        </video>
      } @else {
        <div class="state-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p class="state-text">Loading video...</p>
        </div>
      }
    </div>
  `,
  styles: `
    .video-viewer {
      display: flex;
      align-items: start;
      justify-content: center;
      width: 100%;
      height: 80%;
    }

    .video-element {
      width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 12px;
      background: #000;
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
      width: 100%;
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
export class ViewVideoComponent implements OnInit {
  private viewItemService = inject(ViewItemService);

  @Input({required: true}) item!: ItemEntity;
  @Input() collection: string = '';

  videoUrl$: Observable<string | null> = of(null);

  async ngOnInit(): Promise<void> {
    this.videoUrl$ = await this.viewItemService.makeSignedViewUrl(
      this.item.name,
      this.collection,
    );
  }
}
