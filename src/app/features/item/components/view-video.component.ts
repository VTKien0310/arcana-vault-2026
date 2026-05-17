import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonButton, IonSelect, IonSelectOption, IonSpinner} from '@ionic/angular/standalone';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '@features/item/item.types';
import {ViewItemService} from '@features/item/services/view-item.service';

@Component({
  selector: 'app-comp-view-video',
  standalone: true,
  imports: [CommonModule, IonSpinner, IonButton, IonSelect, IonSelectOption],
  template: `
    <div class="video-viewer">
      @if ((videoUrl$ | async); as videoUrl) {
        <video
          controls
          #videoRef
          [src]="videoUrl"
          class="video-element"
        >
          Your browser does not support the video tag.
        </video>

        <div class="controls-toolbar">
          <div class="skip-controls">
            <ion-button
              size="small"
              fill="outline"
              (click)="seek(-skipAmount)"
            >
              -{{ skipAmount }}s
            </ion-button>

            <ion-select
              [value]="skipAmount"
              interface="popover"
              label="Skip"
              (ionChange)="onSkipAmountChange($event)"
            >
              <ion-select-option [value]="5">5s</ion-select-option>
              <ion-select-option [value]="10">10s</ion-select-option>
              <ion-select-option [value]="15">15s</ion-select-option>
              <ion-select-option [value]="20">20s</ion-select-option>
            </ion-select>

            <ion-button
              size="small"
              fill="outline"
              (click)="seek(skipAmount)"
            >
              +{{ skipAmount }}s
            </ion-button>
          </div>

          <div class="speed-controls">
            <ion-select
              [value]="playbackRate"
              interface="popover"
              label="Speed"
              (ionChange)="setPlaybackRate($event)"
            >
              <ion-select-option [value]="0.5">0.5x</ion-select-option>
              <ion-select-option [value]="0.75">0.75x</ion-select-option>
              <ion-select-option [value]="1">1x</ion-select-option>
              <ion-select-option [value]="1.25">1.25x</ion-select-option>
              <ion-select-option [value]="1.5">1.5x</ion-select-option>
              <ion-select-option [value]="2">2x</ion-select-option>
            </ion-select>
          </div>
        </div>
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80%;
      gap: 12px;
    }

    .video-element {
      width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 12px;
      background: #000;
    }

    .controls-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 100%;
      padding: 8px 0;
    }

    .skip-controls,
    .speed-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ion-select {
      color: var(--ion-color-light);
      font-size: 14px;
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

  @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;

  @Input({required: true}) item!: ItemEntity;
  @Input() collection: string = '';

  videoUrl$: Observable<string | null> = of(null);
  skipAmount = 5;
  playbackRate = 1;

  async ngOnInit(): Promise<void> {
    this.videoUrl$ = await this.viewItemService.makeSignedViewUrl(
      this.item.name,
      this.collection,
    );
  }

  seek(seconds: number): void {
    const video = this.videoRef?.nativeElement;
    if (!video) return;

    let newTime = video.currentTime + seconds;
    video.currentTime = video.duration && isFinite(video.duration)
      ? Math.max(0, Math.min(video.duration, newTime))
      : Math.max(0, newTime);
  }

  setPlaybackRate(event: Event): void {
    const value = (event as CustomEvent).detail.value as number;
    this.playbackRate = value;
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.playbackRate = value;
    }
  }

  onSkipAmountChange(event: Event): void {
    this.skipAmount = (event as CustomEvent).detail.value as number;
  }
}
