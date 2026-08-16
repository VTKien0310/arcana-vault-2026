import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import 'media-chrome';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '@features/item/item.types';
import {ViewItemService} from '@features/item/services/view-item.service';
import {Capacitor} from '@capacitor/core';
import {ScreenOrientation} from '@capacitor/screen-orientation';

@Component({
  selector: 'app-comp-view-video',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <div class="video-viewer">
      @if ((videoUrl$ | async); as videoUrl) {
        <media-controller #mediaCtrl class="player">
          <video
            #videoEl
            slot="media"
            [src]="videoUrl"
            crossorigin
          ></video>
          <media-play-button slot="centered-chrome"
                             class="center-play-button"></media-play-button>
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-seek-backward-button
              seekoffset="10"></media-seek-backward-button>
            <media-seek-forward-button
              seekoffset="10"></media-seek-forward-button>
            <media-time-range></media-time-range>
            <media-duration-display></media-duration-display>
            <media-playback-rate-button
              rates="0.5 0.75 1 1.25 1.5 2"></media-playback-rate-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-pip-button></media-pip-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </media-controller>
        <ion-button
          fill="outline"
          size="small"
          [href]="videoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ion-icon name="open-outline" slot="start"></ion-icon>
          Open in browser
        </ion-button>
      } @else {
        <div class="state-container">
          <media-loading-indicator
            [noAutohide]="true"></media-loading-indicator>
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
      container: player / inline-size;
      --media-background-color: #000;
      --media-primary-color: var(--ion-color-light, #fff);
      --media-secondary-color: rgb(20 20 30 / .7);
      --media-icon-color: var(--ion-color-light, #fff);
    }

    .player::part(media-layer) {
      border-radius: 12px;
    }

    .center-play-button {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      --media-button-icon-width: 44px;
      --media-button-icon-height: 44px;
    }

    .player:not([mediapaused]) .center-play-button {
      display: none;
    }

    .player:fullscreen media-control-bar,
    .player:-webkit-full-screen media-control-bar,
    .player:-moz-full-screen media-control-bar {
      display: flex;
    }

    .player:fullscreen media-control-bar media-play-button,
    .player:fullscreen media-control-bar media-seek-backward-button,
    .player:fullscreen media-control-bar media-seek-forward-button,
    .player:fullscreen media-control-bar media-volume-range,
    .player:-webkit-full-screen media-control-bar media-play-button,
    .player:-webkit-full-screen media-control-bar media-seek-backward-button,
    .player:-webkit-full-screen media-control-bar media-seek-forward-button,
    .player:-webkit-full-screen media-control-bar media-volume-range,
    .player:-moz-full-screen media-control-bar media-play-button,
    .player:-moz-full-screen media-control-bar media-seek-backward-button,
    .player:-moz-full-screen media-control-bar media-seek-forward-button,
    .player:-moz-full-screen media-control-bar media-volume-range {
      display: flex;
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
export class ViewVideoComponent implements OnInit, AfterViewInit, OnDestroy {
  private viewItemService = inject(ViewItemService);

  @Input({required: true}) item!: ItemEntity;
  @Input() collection: string = '';

  @ViewChild('mediaCtrl') mediaCtrl!: ElementRef;
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  private mobileOrientationLockCleanup?: () => void;
  private pendingMetadataCleanup?: () => void;

  videoUrl$: Observable<string | null> = of(null);

  async ngOnInit(): Promise<void> {
    this.videoUrl$ = await this.viewItemService.makeSignedViewUrl(
      this.item.name,
      this.collection,
    );
  }

  async ngAfterViewInit(): Promise<void> {
    const handler = () => this.handleFullscreenChange();

    this.mobileOrientationLockCleanup = () => document.removeEventListener(
      'fullscreenchange', handler);

    document.addEventListener('fullscreenchange', handler);
  }

  private async handleFullscreenChange(): Promise<void> {
    if (!document.fullscreenElement) {
      this.pendingMetadataCleanup?.();
      await this.unlockOrientationOnMobile();
      return;
    }

    const isMobile = navigator.maxTouchPoints > 0;
    if (!isMobile) return;

    const video = this.videoEl?.nativeElement;
    if (!video) return;

    this.pendingMetadataCleanup?.();
    this.pendingMetadataCleanup = undefined;

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth >
      0 && video.videoHeight > 0) {
      await this.lockOrientationForVideo(video);
      return;
    }

    const onLoadedMetadata = async () => {
      this.pendingMetadataCleanup?.();
      if (document.fullscreenElement) {
        await this.lockOrientationForVideo(video);
      }
    };

    this.pendingMetadataCleanup = () => video.removeEventListener(
      'loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
  }

  ngOnDestroy(): void {
    this.mobileOrientationLockCleanup?.();
    this.pendingMetadataCleanup?.();
  }

  private getVideoOrientation(video: HTMLVideoElement): 'landscape' | 'portrait' | null {
    if (!video.videoWidth || !video.videoHeight) return null;
    if (video.videoWidth > video.videoHeight) return 'landscape';
    if (video.videoHeight > video.videoWidth) return 'portrait';
    return null;
  }

  private async lockOrientationForVideo(video: HTMLVideoElement): Promise<void> {
    const orientation = this.getVideoOrientation(video);
    if (!orientation) return;
    await this.lockOrientationOnMobile(orientation);
  }

  private async lockOrientationOnMobile(orientation: 'landscape' | 'portrait'): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await ScreenOrientation.lock({orientation});
        return;
      }

      // PWA and web handling
      if ('orientation' in screen
        && 'lock' in screen.orientation
        && typeof screen.orientation.lock === 'function'
      ) {
        await screen.orientation.lock(orientation);
        return;
      }
    } catch {
      // Graceful degradation — unsupported on iOS Safari and some desktop browsers
    }
  }

  private async unlockOrientationOnMobile(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await ScreenOrientation.unlock();
        return;
      }

      // PWA and web handling
      if ('orientation' in screen && 'unlock' in screen.orientation) {
        screen.orientation.unlock();
        return;
      }
    } catch {
      // Ignore errors
    }
  }
}
