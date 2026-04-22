import {inject, Injectable} from '@angular/core';
import {BackendPort} from '@ports/backend/backend.port';
import {
  SignedUploadUrlEntity,
  SignedUploadUrlResponse,
} from '@features/item/item.types';
import {map, Observable} from 'rxjs';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';

@Injectable({providedIn: 'root'})
export class UploadItemService {
  private readonly endpoint = '/items';
  private backend = inject(BackendPort);

  async makeSignedUploadUrl(
    name: string,
    collection?: string,
  ): Promise<Observable<SignedUploadUrlEntity | null>> {
    const endpoint = `${this.endpoint}/upload-url`;

    return (await this.backend.post<SignedUploadUrlResponse>(endpoint, {
      item: name,
      collection: collection !== undefined ? collection : undefined,
    })).pipe(
      map((response: BackendApiResponse<SignedUploadUrlResponse>) => {
        const responseContent = response.content;

        if (isBackendApiErrorContent(responseContent)) {
          return null;
        }

        return {
          path: responseContent.path,
          token: responseContent.token,
        };
      }),
    );
  }

  async uploadItemToSignedUploadUrl(
    signedUploadUrl: SignedUploadUrlEntity,
    file: File,
  ): Promise<boolean> {
    const {data, error} = await this.backend.spbClient.storage.
      from(this.backend.itemsStorage).
      uploadToSignedUrl(signedUploadUrl.path, signedUploadUrl.token, file);

    return !(error || !data);
  }
}
