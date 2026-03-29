import {inject, Injectable} from '@angular/core';
import {SupabasePort} from '@ports/supabase/supabase.port';
import {ToastPort} from '@ports/toast/toast.port';
import {AuthChangeEvent, Session, User} from '@supabase/supabase-js';
import {Router} from '@angular/router';
import {AppRoutePath} from '@app/app.routes';
import {AuthRoutePath} from '@features/auth/auth.routes';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private supabase = inject(SupabasePort);
  private toast = inject(ToastPort);
  private router = inject(Router);

  async login(email: string, password: string): Promise<void> {
    const {data, error} = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data) {
      await this.toast.error(
        error?.message || 'An error occurred during login.',
      );

      return;
    }

    await this.router.navigate([AppRoutePath.ITEMS]);
  }

  async getUser(): Promise<User | null> {
    const {data: {user}} = await this.supabase.client.auth.getUser();

    return user;
  }

  async getSession(): Promise<Session | null> {
    const {data: {session}} = await this.supabase.client.auth.getSession();

    return session;
  }

  registerOnAuthStateChange(): void {
    this.supabase.client.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const isNotAuthenticated: boolean = !session?.user || event === 'SIGNED_OUT';

        if (isNotAuthenticated) {
          await this.router.navigate([AppRoutePath.AUTH, AuthRoutePath.LOGIN]);
        }
      },
    );
  }
}
