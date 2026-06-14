import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
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
  imports: [CommonModule],
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
          <media-loading-indicator slot="centered-chrome" [noAutohide]="true"></media-loading-indicator>
          <div class="center-controls" slot="centered-chrome">
            <media-play-button></media-play-button>
            <media-seek-backward-button seekoffset="10"></media-seek-backward-button>
            <media-seek-forward-button seekoffset="10"></media-seek-forward-button>
            <media-fullscreen-button></media-fullscreen-button>
          </div>
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
      container: player / inline-size;
      --media-background-color: #000;
      --media-primary-color: var(--ion-color-light, #fff);
      --media-secondary-color: rgb(20 20 30 / .7);
      --media-icon-color: var(--ion-color-light, #fff);
    }

    .player::part(media-layer) {
      border-radius: 12px;
    }

    .center-controls {
      display: none;
      gap: 32px;
      align-items: center;
      justify-content: center;
    }

    .center-controls media-play-button,
    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button,
    .center-controls media-fullscreen-button {
      --media-control-height: 48px;
      --media-control-padding: 16px;
      --media-button-icon-height: 32px;
      --media-secondary-color: transparent;
      border-radius: 50%;
    }

    @container (max-width: 420px) {
      .center-controls {
        display: flex;
      }
      media-control-bar {
        display: none;
      }
    }

    @container (min-width: 420px) and (max-width: 590px) {
      .center-controls {
        display: flex;
      }
      media-control-bar media-play-button,
      media-control-bar media-seek-backward-button,
      media-control-bar media-seek-forward-button,
      media-control-bar media-volume-range {
        display: none;
      }
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

    this.mobileOrientationLockCleanup = () => document.removeEventListener('fullscreenchange', handler);

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

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth > 0 && video.videoHeight > 0) {
      await this.lockOrientationForVideo(video);
      return;
    }

    const onLoadedMetadata = async () => {
      this.pendingMetadataCleanup?.();
      if (document.fullscreenElement) {
        await this.lockOrientationForVideo(video);
      }
    };

    this.pendingMetadataCleanup = () => video.removeEventListener('loadedmetadata', onLoadedMetadata);
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
