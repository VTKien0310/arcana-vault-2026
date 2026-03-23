import {inject, Injectable} from '@angular/core';
import {SupabasePort} from '@ports/supabase/supabase.port';
import {ToastPort} from '@ports/toast/toast.port';
import {AuthChangeEvent, Session, User} from '@supabase/supabase-js';

@Injectable()
export class AuthenticationService {
  private supabase = inject(SupabasePort);
  private toast = inject(ToastPort);

  async login(email: string, password: string): Promise<boolean> {
    const {data, error} = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data) {
      await this.toast.error(
        error?.message || 'An error occurred during login.',
      );

      return false;
    }

    return true;
  }

  async getUser(): Promise<User | null> {
    const {data: {user}} = await this.supabase.client.auth.getUser();

    return user;
  }

  async getSession(): Promise<Session | null> {
    const {data: {session}} = await this.supabase.client.auth.getSession();

    if (!session) {
      await this.toast.error('Session not found.');
    }

    return session;
  }

  async registerOnAuthStateChange(): Promise<void> {
    this.supabase.client.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {

      },
    );
  }
}
