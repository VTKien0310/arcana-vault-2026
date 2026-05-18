import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import 'media-chrome';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '@features/item/item.types';
import {ViewItemService} from '@features/item/services/view-item.service';

@Component({
  selector: 'app-comp-view-video',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  template: `
    <div class="video-viewer">
      @if ((videoUrl$ | async); as videoUrl) {
        <media-controller class="player">
          <video
            slot="media"
            [src]="videoUrl"
            crossorigin
          ></video>
          <media-loading-indicator slot="centered-chrome" [noAutohide]="true"></media-loading-indicator>
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-seek-backward-button seekoffset="10"></media-seek-backward-button>
            <media-seek-forward-button seekoffset="10"></media-seek-forward-button>
            <media-time-display></media-time-display>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button rates="0.5 0.75 1 1.25 1.5 2"></media-playback-rate-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-pip-button></media-pip-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </media-controller>
      } @else {
        <div class="state-container">
          <media-loading-indicator [noAutohide]="true"></media-loading-indicator>
          <p class="state-text">Loading video...</p>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .video-viewer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80%;
      gap: 12px;
    }

    .player {
      width: 100%;
      max-height: 100%;
      border-radius: 12px;
      --media-background-color: #000;
      --media-primary-color: var(--ion-color-light, #fff);
      --media-secondary-color: rgb(20 20 30 / .7);
      --media-icon-color: var(--ion-color-light, #fff);
    }

    .player::part(media-layer) {
      border-radius: 12px;
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
