import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {User} from '@supabase/supabase-js';

@Injectable()
export class AuthenticationState {
  private readonly _user: WritableSignal<User | null> = signal(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  setUser(user: User | null): void {
    this._user.set(user);
  }
}
