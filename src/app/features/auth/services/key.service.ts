import {inject, Injectable} from '@angular/core';
import {BackendApiResponse, BackendPort} from '@ports/backend/backend.port';
import {RefreshKeyResponse} from '@features/auth/types/key.types';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class KeyService {
  private readonly endpoint = '/key';
  private backend = inject(BackendPort);

  refresh(): Promise<Observable<BackendApiResponse<RefreshKeyResponse>>> {
    const endpoint = `${this.endpoint}/refresh`;

    return this.backend.post<RefreshKeyResponse>(endpoint);
  }
}
