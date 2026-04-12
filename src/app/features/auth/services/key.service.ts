import {inject, Injectable} from '@angular/core';
import {BackendPort} from '@ports/backend/backend.port';
import {
  KeyChannel, KeyInfo,
  RefreshKeyResponse,
  SubmitKeyResponse,
} from '@features/auth/types/key.types';
import {catchError, map, Observable} from 'rxjs';
import {
  BackendApiErrorContent,
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';
import {ToastService} from '@features/master/services/toast.service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class KeyService {
  private readonly endpoint = '/key';
  private backend = inject(BackendPort);
  private toast = inject(ToastService);

  async refresh(): Promise<Observable<KeyInfo | null>> {
    const endpoint = `${this.endpoint}/refresh`;

    return (await this.backend.post<RefreshKeyResponse>(endpoint)).pipe(
      map((response: BackendApiResponse<RefreshKeyResponse>) => {
        const keyData = response.content;
        if (isBackendApiErrorContent(keyData)) return null;

        return {
          expiration: keyData.expiration,
          channels: keyData.channels.
            map(
              (channel: KeyChannel) => KeyChannel.name(channel),
            ).
            join(', '),
        };
      }),
    );
  }

  async submit(key: string): Promise<Observable<boolean>> {
    const endpoint = `${this.endpoint}/submit`;

    return (await this.backend.post<SubmitKeyResponse>(endpoint, {
      value: key,
    })).pipe(
      map((response: BackendApiResponse<SubmitKeyResponse>) => {
        const responseContent = response.content;

        if (isBackendApiErrorContent(responseContent)) {
          return false;
        }

        this.backend.saveSecretJwtKey(responseContent.secret).then();

        return true;
      }),
      catchError(async (response: HttpErrorResponse) => {
        const responseContent = response.error.content as BackendApiErrorContent;

        responseContent.error.code === 'invalid_key_for_user'
          ? await this.toast.error('Incorrect code submitted.')
          : await this.toast.error(responseContent.error.message);

        return false;
      }),
    );
  }
}
