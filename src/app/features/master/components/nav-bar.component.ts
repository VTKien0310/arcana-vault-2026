import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,

} from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {AppRoutePath} from '@app/app.routes';

type NavItem = { label: string, path: string };

@Component({
  selector: 'app-comp-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          @for (navItem of navItems; track navItem.path) {
            <ion-button
              (click)="navigateToNavItem(navItem)"
              [disabled]="isCurrentNavItem(navItem)"
              fill="clear"
              class="nav-button"
            >
              {{ navItem.label }}
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
      label: 'Items',
      path: AppRoutePath.ITEMS,
    },
  ];

  navigateToNavItem(item: NavItem): void {
    this.router.navigate([item.path]).then();
  }

  isCurrentNavItem(item: NavItem): boolean {
    return this.router.url.includes(item.path, 1);
  }
}
