import {Component, inject} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  AuthenticationService
} from '@features/auth/services/authentication.service';
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
      folderOpen
    });

    this.authenticationService.registerOnAuthStateChange();
  }
}
