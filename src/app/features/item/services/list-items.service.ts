import {inject, Injectable} from '@angular/core';
import {BackendPort} from '@ports/backend/backend.port';
import {ItemEntity} from '@features/item/types/item.types';
import {map, Observable} from 'rxjs';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';

@Injectable({providedIn: 'root'})
export class ListItemsService {
  private readonly endpoint = '/items';
  private backend = inject(BackendPort);

  async listItems(): Promise<Observable<ItemEntity[]>> {
    return (await this.backend.get<ItemEntity[]>(this.endpoint)).pipe(
      map((response: BackendApiResponse<ItemEntity[]>) => {
        const responseContent = response.content;
        if (isBackendApiErrorContent(responseContent)) return [];

        return responseContent;
      }),
    );
  }
}
