import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  AuthenticationService
} from '@features/auth/services/authentication.service';
import {Router} from '@angular/router';
import {AppRoutePath} from '@app/app.routes';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="app-name-font">Arcane Vault</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.invalid]="email?.invalid && email?.touched"
            />
            @if (email?.invalid && email?.touched) {
              <span class="error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              [class.invalid]="password?.invalid && password?.touched"
            />
            @if (password?.invalid && password?.touched) {
              <span class="error">Password is required</span>
            }
          </div>

          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1.5rem;
      background:
        radial-gradient(circle at left center, var(--app-glow-cyan), transparent 32%),
        radial-gradient(circle at right center, var(--app-glow-amber), transparent 30%),
        radial-gradient(circle at center, var(--app-glow-violet), transparent 28%),
        linear-gradient(135deg, var(--app-bg-start) 0%, var(--app-bg-mid) 45%, var(--app-bg-end) 100%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 24px;
      border: 1px solid var(--ion-border-color);
      background:
        linear-gradient(180deg, var(--app-surface) 0%, var(--app-surface-strong) 100%);
      box-shadow:
        0 0 0 1px rgba(var(--ion-color-primary-rgb), 0.08),
        0 18px 48px rgba(2, 6, 23, 0.55),
        0 0 32px var(--app-glow-cyan-strong);
      backdrop-filter: blur(10px);
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      letter-spacing: 0.04em;
      color: var(--ion-text-color);
      text-shadow: 0 0 18px var(--app-title-glow);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--ion-color-primary);
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    input {
      width: 100%;
      padding: 0.9rem 1rem;
      border: 1px solid var(--app-border-soft);
      border-radius: 12px;
      font-size: 1rem;
      transition:
        border-color 0.3s,
        box-shadow 0.3s,
        background-color 0.3s,
        transform 0.2s;
      box-sizing: border-box;
      background: var(--app-input-bg);
      color: var(--ion-text-color);
    }

    input::placeholder {
      color: rgba(var(--ion-text-color-rgb), 0.45);
    }

    input:focus {
      outline: none;
      border-color: var(--ion-color-primary);
      box-shadow:
        0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.14),
        0 0 18px rgba(var(--ion-color-primary-rgb), 0.18);
      background: var(--app-input-bg-focus);
      transform: translateY(-1px);
    }

    input.invalid {
      border-color: var(--ion-color-danger);
      box-shadow: 0 0 0 3px rgba(var(--ion-color-danger-rgb), 0.12);
    }

    .error {
      display: block;
      margin-top: 0.4rem;
      color: var(--ion-color-danger);
      font-size: 0.875rem;
    }

    button {
      width: 100%;
      padding: 0.9rem 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      cursor: pointer;
      color: var(--ion-color-tertiary-contrast);
      background:
        linear-gradient(
          135deg,
          var(--ion-color-warning) 0%,
          var(--ion-color-tertiary) 45%,
          #f39649 100%
        );
      box-shadow:
        0 10px 22px rgba(var(--ion-color-tertiary-rgb), 0.28),
        0 0 18px rgba(var(--ion-color-warning-rgb), 0.18);
      transition:
        transform 0.2s,
        box-shadow 0.3s,
        filter 0.3s;
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.03);
      box-shadow:
        0 14px 26px rgba(var(--ion-color-tertiary-rgb), 0.34),
        0 0 22px rgba(var(--ion-color-warning-rgb), 0.24);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: linear-gradient(135deg, var(--ion-color-step-400) 0%, var(--ion-color-step-300) 100%);
      color: rgba(var(--ion-text-color-rgb), 0.65);
      box-shadow: none;
      cursor: not-allowed;
    }
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (! this.loginForm.valid) return;

    const {email, password} = this.loginForm.getRawValue();
    const success = await this.authenticationService.login(email, password);

    if (!success) return;

    await this.router.navigate([AppRoutePath.ITEMS]);
  }
}
