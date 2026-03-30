import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environments/environment';

@Injectable({providedIn: 'root'})
export class BackendPort {
  public readonly rootEndpoint: string;
  public readonly client: SupabaseClient;

  constructor() {
    this.rootEndpoint = environment.apiEndpoint;
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }
}
