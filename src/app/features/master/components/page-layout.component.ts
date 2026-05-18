import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from '@features/master/components/nav-bar.component';

/**
 * Page layout component that provides a consistent shell for pages.
 *
 * Usage:
 * <app-comp-page-layout>
 *   <div class="your-page-content">Content here</div>
 * </app-comp-page-layout>
 */
@Component({
  selector: 'app-comp-page-layout',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
  ],
  template: `
    <app-comp-nav-bar></app-comp-nav-bar>
    <div class="page-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-container {
      padding: 16px;
      height: 90dvh;
      overflow-y: auto;
    }

    @media (max-height: 500px) {
      .page-container {
        height: 80dvh;
      }
    }
  `
})
export class PageLayoutComponent {}
