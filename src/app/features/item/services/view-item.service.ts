import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, map} from 'rxjs';
import {
  ItemEntity,
  ItemViewInfo,
} from '@features/item/types/item.types';
import {UtilItemService} from '@features/item/services/util-item.service';

@Injectable({providedIn: 'root'})
export class ViewItemService {
  private utilItemService = inject(UtilItemService);
  private _item$ = new BehaviorSubject<ItemEntity | null>(null);

  get item$(): Observable<ItemEntity | null> {
    return this._item$.asObservable();
  }

  get viewItem$(): Observable<ItemViewInfo | null> {
    return this._item$.pipe(
      map((item) =>
        item
          ? {item, itemType: this.utilItemService.getItemType(item)}
          : null,
      ),
    );
  }

  setItem(item: ItemEntity): void {
    this._item$.next(item);
  }

  clearItem(): void {
    this._item$.next(null);
  }
}
