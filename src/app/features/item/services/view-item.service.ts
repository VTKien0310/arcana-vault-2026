import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, map} from 'rxjs';
import {
  ItemEntity,
  ItemViewInfo, SignedViewUrlEntity,
} from '@features/item/types/item.types';
import {UtilItemService} from '@features/item/services/util-item.service';
import {BackendPort} from '@ports/backend/backend.port';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';

@Injectable({providedIn: 'root'})
export class ViewItemService {
  private readonly endpoint = '/items';
  private backend = inject(BackendPort);

  private utilItemService = inject(UtilItemService);

  private _item$ = new BehaviorSubject<ItemEntity | null>(null);

  get item$(): Observable<ItemEntity | null> {
    return this._item$.asObservable();
  }

  setItem(item: ItemEntity): void {
    this._item$.next(item);
  }

  clearItem(): void {
    this._item$.next(null);
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

  private _collection$ = new BehaviorSubject<string>('');

  get collection$(): Observable<string> {
    return this._collection$.asObservable();
  }

  setCollection(collection: string): void {
    this._collection$.next(collection);
  }

  clearCollection(): void {
    this._collection$.next('');
  }

  async makeSignedViewUrl(
    name: string,
    collection?: string,
  ): Promise<Observable<string | null>> {
    collection = (
      collection !== undefined
      && collection !== null
      && collection !== ''
    ) ? collection : undefined;

    return (await this.backend.post<SignedViewUrlEntity>(
      `${this.endpoint}/view-url`,
      {
        item: name,
        collection: collection,
      },
    )).pipe(
      map((response: BackendApiResponse<SignedViewUrlEntity>) => {
        const responseContent = response.content;
        if (isBackendApiErrorContent(responseContent)) {
          return null;
        }

        return responseContent.url;
      }),
    );
  }
}
