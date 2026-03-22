import {inject} from '@angular/core';
import {SupabasePort} from '@ports/supabase/supabase.port';

export class AuthenticationService {
  private supabase = inject(SupabasePort);

  async login(email: string, password: string): Promise<boolean> {
    const {data, error} = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    return !(error || !data.user);
  }
}
