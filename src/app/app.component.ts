import {Component, effect, inject} from '@angular/core';
import { IonApp, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';
import {
  AuthenticationService
} from '@features/auth/services/authentication.service';
import {AppUpdateService} from '@features/master/services/app-update.service';
import { addIcons } from 'ionicons';
import {
  list,
  layers,
  cloudUpload,
  videocam,
  image,
  closeCircle,
  checkmarkCircle,
  folder,
  folderOpen,
  logOut,
  swapVertical,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  private authenticationService = inject(AuthenticationService);
  private appUpdateService = inject(AppUpdateService);
  private alertController = inject(AlertController);

  constructor() {
    addIcons({
      list,
      layers,
      cloudUpload,
      videocam,
      image,
      closeCircle,
      checkmarkCircle,
      folder,
      folderOpen,
      logOut,
      swapVertical,
    });

    this.authenticationService.registerOnAuthStateChange();

    effect(() => {
      if (this.appUpdateService.updateAvailable()) {
        void this.showUpdateAlert();
      }
    });
  }

  private async showUpdateAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Update available',
      message:
        'A new version of Arcana Vault is available. Please refresh to continue.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Refresh now',
          handler: () => {
            void this.appUpdateService.activateAndReload();
          },
        },
      ],
    });

    await alert.present();
  }
}
