import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonIcon, IonSpinner} from '@ionic/angular/standalone';
import {Observable, of} from 'rxjs';
import {ItemEntity} from '@features/item/item.types';
import {ViewItemService} from '@features/item/services/view-item.service';

@Component({
  selector: 'app-comp-view-image',
  standalone: true,
  imports: [CommonModule, IonSpinner],
  template: `
    <div class="image-viewer">
      @if ((imageUrl$ | async); as imageUrl) {
        <img
          [src]="imageUrl"
          [alt]="item.name"
          class="image-element"
        />
      } @else {
        <div class="state-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p class="state-text">Loading image...</p>
        </div>
      }
    </div>
  `,
  styles: `
    .image-viewer {
      display: flex;
      align-items: start;
      justify-content: center;
      width: 100%;
      height: 80%;
    }

    .image-element {
      width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 12px;
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
export class ViewImageComponent implements OnInit {
  private viewItemService = inject(ViewItemService);

  @Input({required: true}) item!: ItemEntity;
  @Input() collection: string = '';

  imageUrl$: Observable<string | null> = of(null);

  async ngOnInit(): Promise<void> {
    this.imageUrl$ = await this.viewItemService.makeSignedViewUrl(
      this.item.name,
      this.collection,
    );
  }
}
