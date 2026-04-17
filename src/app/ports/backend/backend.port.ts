import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';
import {
  BackendApiResponse,
} from '@ports/backend/backend.types';
import {Preferences} from '@capacitor/preferences';

@Injectable({providedIn: 'root'})
export class BackendPort {
  public readonly rootEndpoint: string;
  public readonly spbClient: SupabaseClient;
  private readonly http = inject(HttpClient);

  public readonly itemsStorage: string = 'arcana-vault'

  constructor() {
    this.rootEndpoint = environment.apiEndpoint;
    this.spbClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<Observable<BackendApiResponse<T>>> {
    return this.request<T>('GET', path, undefined, params);
  }

  async post<T>(
    path: string,
    body?: Record<string, unknown>,
    params?: Record<string, string>,
  ): Promise<Observable<BackendApiResponse<T>>> {
    return this.request<T>('POST', path, body, params);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    params?: Record<string, string>,
  ): Promise<Observable<BackendApiResponse<T>>> {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    const {data: {session}} = await this.spbClient.auth.getSession();
    if (session?.access_token) {
      headers = headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const secretJwtKey = await this.getSecretJwtKey();
    if (secretJwtKey) {
      headers = headers.set('X-SECRET-JWT', secretJwtKey);
    }

    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, value);
      }
    }

    const url = `${this.rootEndpoint}${path}`;
    return this.http.request<BackendApiResponse<T>>(method, url, {
      headers,
      body: body !== undefined ? body : undefined,
      params: httpParams,
    });
  }

  async saveSecretJwtKey(jwt: string): Promise<void> {
    await Preferences.set({
      key: 'backend-jwt-key',
      value: jwt,
    });
  }

  async removeSecretJwtKey(): Promise<void> {
    await Preferences.remove({key: 'backend-jwt-key'});
  }

  private async getSecretJwtKey(): Promise<string | null> {
    const {value} = await Preferences.get({key: 'backend-jwt-key'});

    return value;
  }
}
