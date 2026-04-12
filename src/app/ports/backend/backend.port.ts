import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  constructor() {
    this.rootEndpoint = environment.apiEndpoint;
    this.spbClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  async get<T>(path: string): Promise<Observable<BackendApiResponse<T>>> {
    return this.request<T>('GET', path);
  }

  async post<T>(
    path: string,
    body?: unknown,
  ): Promise<Observable<BackendApiResponse<T>>> {
    return this.request<T>('POST', path, body);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
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

    const url = `${this.rootEndpoint}${path}`;
    return this.http.request<BackendApiResponse<T>>(method, url, {
      headers,
      body: body !== undefined ? body : undefined,
    });
  }

  async saveSecretJwtKey(jwt: string) {
    await Preferences.set({
      key: 'backend-jwt-key',
      value: jwt,
    });
  }

  private async getSecretJwtKey(): Promise<string | null> {
    const {value} = await Preferences.get({key: 'backend-jwt-key'});

    return value;
  }
}
