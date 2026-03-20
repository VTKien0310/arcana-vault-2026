import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
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
      background-color: var(--ion-color-step-50);
    }

    .login-card {
      background: var(--ion-card-background);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--ion-text-color);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--ion-color-step-600);
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--ion-border-color);
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
      background-color: var(--ion-item-background);
      color: var(--ion-text-color);
    }

    input:focus {
      outline: none;
      border-color: var(--ion-color-primary);
    }

    input.invalid {
      border-color: var(--ion-color-danger);
    }

    .error {
      display: block;
      color: var(--ion-color-danger);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--ion-color-primary);
      color: var(--ion-color-primary-contrast);
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
      background-color: var(--ion-color-primary-shade);
    }

    button:disabled {
      background-color: var(--ion-color-step-200);
      cursor: not-allowed;
    }
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);

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

  onSubmit() {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.getRawValue();
      console.log('Login attempt:', {email, password});
      // TODO: Implement authentication logic
    }
  }
}
