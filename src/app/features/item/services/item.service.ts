import {inject, Injectable} from '@angular/core';
import {BackendPort} from '@ports/backend/backend.port';
import {ToastService} from '@features/master/services/toast.service';
import {Router} from '@angular/router';
import {
  SignedUploadUrlEntity,
  SignedUploadUrlResponse,
} from '@features/item/types/item.types';
import {map, Observable} from 'rxjs';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';

@Injectable({providedIn: 'root'})
export class ItemService {
  private readonly endpoint = '/items';
  private backend = inject(BackendPort);
  private toast = inject(ToastService);
  private router = inject(Router);

  async makeUploadUrl(
    name: string,
    collection?: string,
  ): Promise<Observable<SignedUploadUrlEntity | null>> {
    const endpoint = `${this.endpoint}/upload-url`;

    return (await this.backend.post<SignedUploadUrlResponse>(endpoint, {
      name: name,
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

  async uploadItemToSignedUrl(
    signedUploadUrl: SignedUploadUrlEntity,
    file: File,
  ): Promise<boolean> {
    const {data, error} = await this.backend.spbClient.storage.
      from(this.backend.itemsStorage).
      uploadToSignedUrl(signedUploadUrl.path, signedUploadUrl.token, file);

    if (error || !data) {
      await this.toast.error('Failed to upload item to the signed URL');

      return false;
    }

    await this.toast.success('Item uploaded successfully');

    return true;
  }
}
