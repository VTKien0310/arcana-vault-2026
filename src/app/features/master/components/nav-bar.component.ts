import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {AppRoutePath} from '@app/app.routes';

type NavItem = {
  name: string,
  icon: string,
  path: string[]
};

@Component({
  selector: 'app-comp-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          @for (navItem of navItems; track navItem.name) {
            <ion-button
              (click)="navigateToNavItem(navItem)"
              [disabled]="appIsAtNavItem(navItem)"
              class="nav-button"
              [title]="navItem.name"
            >
              <ion-icon [name]="navItem.icon" slot="icon-only"></ion-icon>
            </ion-button>
          }
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styles: `
    ion-toolbar {
      --background: var(--app-surface);
      --border-color: var(--app-border-soft);
      border-bottom: 1px solid var(--app-border-soft);
    }

    ion-title {
      color: var(--ion-color-primary);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .nav-button {
      --color: var(--ion-color-light);
      --color-activated: var(--ion-color-primary);
      --color-hover: var(--ion-color-primary);
      --ripple-color: var(--ion-color-primary);
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .nav-button:hover {
      color: var(--ion-color-primary);
      text-shadow: 0 0 8px var(--app-glow-cyan);
    }

    .nav-button[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }

    .nav-button:not([disabled]):hover {
      color: var(--ion-color-primary);
    }
  `
})
export class NavBarComponent {
  private router = inject(Router);

  navItems: NavItem[] = [
    {
      name: 'items',
      icon: 'list',
      path: [AppRoutePath.ITEMS],
    },
  ];

  navigateToNavItem(item: NavItem): void {
    this.router.navigate(item.path).then();
  }

  appIsAtNavItem(item: NavItem): boolean {
    return this.router.url === '/' + item.path.join('/');
  }
}
