import {inject, Injectable} from '@angular/core';
import {SupabasePort} from '@ports/supabase/supabase.port';
import {ToastPort} from '@ports/toast/toast.port';
import {AuthenticationState} from '@features/auth/states/authentication.state';

@Injectable()
export class AuthenticationService {
  private supabase = inject(SupabasePort);
  private toast = inject(ToastPort);
  private authState = inject(AuthenticationState);

  async login(email: string, password: string): Promise<boolean> {
    const {data, error} = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data) {
      await this.toast.error(
        error?.message || 'An error occurred during login.',
      );

      this.authState.setUser(null);

      return false;
    }

    this.authState.setUser(data.user);

    return true;
  }
}
