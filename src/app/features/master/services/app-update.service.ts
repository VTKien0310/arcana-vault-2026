import {DestroyRef, Injectable, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {Capacitor} from '@capacitor/core';
import {EMPTY, from, fromEvent, interval} from 'rxjs';
import {catchError, filter, switchMap} from 'rxjs/operators';

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
const STARTUP_CHECK_DELAY_MS = 5 * 1000;

@Injectable({providedIn: 'root'})
export class AppUpdateService {
  readonly updateAvailable = signal(false);

  private readonly swUpdate = inject(SwUpdate);
  private readonly destroyRef = inject(DestroyRef);
  private startupCheckTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (Capacitor.isNativePlatform()) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter(
          (event): event is VersionReadyEvent => event.type === 'VERSION_READY',
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateAvailable.set(true));

    this.swUpdate.unrecoverable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateAvailable.set(true));

    this.startupCheckTimeoutId = setTimeout(
      () => void this.checkForUpdate(),
      STARTUP_CHECK_DELAY_MS,
    );

    fromEvent(document, 'visibilitychange')
      .pipe(
        filter(() => document.visibilityState === 'visible'),
        switchMap(() => this.checkForUpdate()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    interval(UPDATE_CHECK_INTERVAL_MS)
      .pipe(
        filter(() => document.visibilityState === 'visible'),
        switchMap(() => this.checkForUpdate()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.destroyRef.onDestroy(() => {
      if (this.startupCheckTimeoutId !== null) {
        clearTimeout(this.startupCheckTimeoutId);
      }
    });
  }

  async activateAndReload(): Promise<void> {
    await this.swUpdate.activateUpdate();
    document.location.reload();
  }

  private checkForUpdate() {
    return from(this.swUpdate.checkForUpdate()).pipe(catchError(() => EMPTY));
  }
}
