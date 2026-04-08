import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {KeyService} from '@features/auth/services/key.service';
import {KeyChannel, RefreshKeyResponse} from '@features/auth/types/key.types';
import {
  BackendApiResponse,
  isBackendApiErrorContent,
} from '@ports/backend/backend.types';
import {AsyncPipe, DatePipe} from '@angular/common';
import {map, Observable, of} from 'rxjs';

@Component({
  selector: 'app-page-key',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
  ],
  template: `
    <div class="otp-container">
      <div class="otp-card">
        <h1>Verify Your Identity</h1>
        <p class="subtitle">Enter the 8-digit code sent to your secret
          channels</p>

        @if (key$ | async; as keyResponse) {
          <div class="key-info">
            <span class="expiration">Expires at: {{keyResponse.expiration | date:'medium'}}</span>
            @if (keyResponse.channels.length > 0) {
              <span class="channels">Sent via: {{
                  mapToChannelNames(keyResponse.channels)
                }}</span>
            }
          </div>
        }

        <form [formGroup]="otpForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="otp">Secret Code</label>
            <input
              id="otp"
              type="text"
              inputmode="numeric"
              maxlength="8"
              formControlName="otp"
              placeholder="00000000"
              [class.invalid]="otp?.invalid && otp?.touched"
            />
            @if (otp?.invalid && otp?.touched) {
              <span class="error">Please enter a valid 8-digit code</span>
            }
          </div>

          <button type="submit" [disabled]="otpForm.invalid">Verify</button>
        </form>

        <div class="resend-section">
          @if (canResend) {
            <button type="button" class="resend-btn" (click)="onResend()">
              Resend Code
            </button>
          } @else {
            <span class="countdown">Resend available in {{ countdown }}s</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .otp-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1.5rem;
      background: radial-gradient(circle at left center, var(--app-glow-cyan), transparent 32%),
      radial-gradient(circle at right center, var(--app-glow-amber), transparent 30%),
      radial-gradient(circle at center, var(--app-glow-violet), transparent 28%),
      linear-gradient(135deg, var(--app-bg-start) 0%, var(--app-bg-mid) 45%, var(--app-bg-end) 100%);
    }

    .otp-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 24px;
      border: 1px solid var(--ion-border-color);
      background: linear-gradient(180deg, var(--app-surface) 0%, var(--app-surface-strong) 100%);
      box-shadow: 0 0 0 1px rgba(var(--ion-color-primary-rgb), 0.08),
      0 18px 48px rgba(2, 6, 23, 0.55),
      0 0 32px var(--app-glow-cyan-strong);
      backdrop-filter: blur(10px);
    }

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
      letter-spacing: 0.04em;
      color: var(--ion-text-color);
      text-shadow: 0 0 18px var(--app-title-glow);
    }

    .subtitle {
      text-align: center;
      margin-bottom: 2rem;
      color: rgba(var(--ion-text-color-rgb), 0.7);
      font-size: 0.95rem;
    }

    .key-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding: 0.75rem 1rem;
      background: rgba(var(--ion-color-primary-rgb), 0.08);
      border-radius: 12px;
      border: 1px solid rgba(var(--ion-color-primary-rgb), 0.15);
    }

    .key-info .expiration {
      color: var(--ion-color-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .key-info .channels {
      color: rgba(var(--ion-text-color-rgb), 0.8);
      font-size: 0.85rem;
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
      font-size: 1.25rem;
      text-align: center;
      letter-spacing: 0.15em;
      font-family: monospace;
      transition: border-color 0.3s,
      box-shadow 0.3s,
      background-color 0.3s,
      transform 0.2s;
      box-sizing: border-box;
      background: var(--app-input-bg);
      color: var(--ion-text-color);
    }

    input::placeholder {
      color: rgba(var(--ion-text-color-rgb), 0.45);
      letter-spacing: 0.1em;
    }

    input:focus {
      outline: none;
      border-color: var(--ion-color-primary);
      box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.14),
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

    button[type="submit"] {
      width: 100%;
      padding: 0.9rem 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      cursor: pointer;
      color: var(--ion-color-tertiary-contrast);
      background: linear-gradient(
        135deg,
        var(--ion-color-warning) 0%,
        var(--ion-color-tertiary) 45%,
        #f39649 100%
      );
      box-shadow: 0 10px 22px rgba(var(--ion-color-tertiary-rgb), 0.28),
      0 0 18px rgba(var(--ion-color-warning-rgb), 0.18);
      transition: transform 0.2s,
      box-shadow 0.3s,
      filter 0.3s;
    }

    button[type="submit"]:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.03);
      box-shadow: 0 14px 26px rgba(var(--ion-color-tertiary-rgb), 0.34),
      0 0 22px rgba(var(--ion-color-warning-rgb), 0.24);
    }

    button[type="submit"]:active:not(:disabled) {
      transform: translateY(0);
    }

    button[type="submit"]:disabled {
      background: linear-gradient(135deg, var(--ion-color-step-400) 0%, var(--ion-color-step-300) 100%);
      color: rgba(var(--ion-text-color-rgb), 0.65);
      box-shadow: none;
      cursor: not-allowed;
    }

    .resend-section {
      margin-top: 1.5rem;
      text-align: center;
    }

    .resend-btn {
      background: transparent;
      border: none;
      color: var(--ion-color-primary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: background-color 0.2s,
      color 0.2s;
    }

    .resend-btn:hover {
      background: rgba(var(--ion-color-primary-rgb), 0.1);
      color: var(--ion-color-primary-tint);
    }

    .countdown {
      color: rgba(var(--ion-text-color-rgb), 0.5);
      font-size: 0.9rem;
    }
  `,
})
export class KeyPage implements OnInit {
  private fb = inject(FormBuilder);
  private keyService = inject(KeyService);

  otpForm = this.fb.nonNullable.group({
    otp: [
      '', [
        Validators.required,
        Validators.pattern(/^\d{8}$/),
        Validators.minLength(8),
        Validators.maxLength(8),
      ]],
  });

  canResend = true;
  countdown = 30;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  key$: Observable<RefreshKeyResponse | null> = of(null);

  get otp() {
    return this.otpForm.get('otp');
  }

  async ngOnInit() {
    await this.requestRefreshKey();
  }

  private async requestRefreshKey() {
    this.key$ = (await this.keyService.refresh()).pipe(
      map((response: BackendApiResponse<RefreshKeyResponse>) => {
        const keyData = response.content;
        if (isBackendApiErrorContent(keyData)) return null;

        return keyData;
      }),
    );
  }

  mapToChannelNames(channels: KeyChannel[]): string {
    return channels.
      map((channel: KeyChannel) => KeyChannel.name(channel)).
      join(', ');
  }

  async onSubmit() {
    if (!this.otpForm.valid) return;

    const {otp} = this.otpForm.getRawValue();
    console.log('OTP submitted:', otp);
    // TODO: Implement OTP verification logic
  }

  async onResend() {
    if (!this.canResend) return;

    await this.requestRefreshKey();

    this.canResend = false;
    this.countdown = 30;

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      }
    }, 1000);
  }
}
