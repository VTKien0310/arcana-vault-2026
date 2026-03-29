import {Component, inject} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  AuthenticationService
} from '@features/auth/services/authentication.service';

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
    this.authenticationService.registerOnAuthStateChange();
  }
}
