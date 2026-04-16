import {inject, Injectable} from '@angular/core';
import {BackendPort} from '@ports/backend/backend.port';
import {ItemEntity} from '@features/item/types/item.types';
import {map, Observable, of} from 'rxjs';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';

@Injectable({providedIn: 'root'})
export class ListItemsService {
  private readonly endpoint = '/items';
  private backend = inject(BackendPort);

  private _items$: Observable<ItemEntity[]> = of([]);
  get items$(): Observable<ItemEntity[]> {
    return this._items$;
  }

  /**
   * Cache the count of items for quick access in other logic.
   *
   * @private
   */
  private itemsCount: number = 0

  private async fetchItemsList(): Promise<Observable<ItemEntity[]>> {
    return (await this.backend.get<ItemEntity[]>(this.endpoint)).pipe(
      map((response: BackendApiResponse<ItemEntity[]>) => {
        const responseContent = response.content;
        if (isBackendApiErrorContent(responseContent)) {
          this.itemsCount = 0

          return []
        }

        this.itemsCount = responseContent.length

        return responseContent;
      }),
    );
  }

  async reloadItemsList(): Promise<void> {
    this._items$ = await this.fetchItemsList();
  }

  async fetchItemsIfEmpty(): Promise<void> {
    if (this.itemsCount > 0) {
      return
    }

    this._items$ = await this.fetchItemsList();
  }
}
