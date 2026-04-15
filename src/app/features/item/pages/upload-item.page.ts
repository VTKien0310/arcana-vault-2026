import {Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonProgressBar, IonText,
} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-page-upload-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageLayoutComponent,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonProgressBar,
    IonText,
  ],
  template: `
    <app-comp-page-layout>
      <div class="page-content">
        <h1>Upload Item</h1>

        <div class="input-section">
          <ion-item class="input-item">
            <ion-input
              labelPlacement="stacked"
              [(ngModel)]="name"
              (ionInput)="validateField('name')"
              placeholder="Enter a name"
              [clearInput]="true"
            >
              <div slot="label">Name<ion-text color="danger"> *</ion-text></div>
            </ion-input>
          </ion-item>
          @if (nameError) {
            <p class="field-error">{{ nameError }}</p>
          }

          <ion-item class="input-item">
            <ion-input
              label="Collection"
              labelPlacement="stacked"
              [(ngModel)]="collection"
              (ionInput)="validateField('collection')"
              placeholder="Enter a collection (optional)"
              [clearInput]="true"
            ></ion-input>
          </ion-item>
          @if (collectionError) {
            <p class="field-error">{{ collectionError }}</p>
          }
        </div>

        <div
          class="upload-zone"
          [class.upload-zone--active]="state === 'selected'"
        >
          <input
            #fileInput
            type="file"
            accept="video/*"
            (change)="onFileSelected($event)"
            class="file-input"
          />

          @switch (state) {
            @case ('idle') {
              <div class="upload-idle">
                <ion-icon name="cloud-upload" class="upload-icon"></ion-icon>
                <p class="upload-hint">Select a video file to upload</p>
                <ion-button (click)="fileInput.click()" expand="block">
                  <ion-icon name="videocam" slot="start"></ion-icon>
                  Select Video
                </ion-button>
              </div>
            }

            @case ('selected') {
              <div class="upload-selected">
                <ion-icon name="videocam" class="upload-icon"></ion-icon>
                <p class="file-name">{{ selectedFile?.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile?.size ?? 0) }}</p>
                <div class="upload-actions">
                  <ion-button (click)="upload()" expand="block" [disabled]="!canUpload">
                    <ion-icon name="cloud-upload" slot="start"></ion-icon>
                    Upload
                  </ion-button>
                  <ion-button
                    (click)="clearSelection()"
                    fill="outline"
                    expand="block"
                  >
                    <ion-icon name="close-circle" slot="start"></ion-icon>
                    Remove
                  </ion-button>
                </div>
              </div>
            }

            @case ('uploading') {
              <div class="upload-progress">
                <p class="file-name">{{ selectedFile?.name }}</p>
                <ion-progress-bar [value]="uploadProgress" type="determinate"></ion-progress-bar>
                <p class="progress-text">{{ Math.round(uploadProgress * 100) }}%</p>
              </div>
            }

            @case ('success') {
              <div class="upload-success">
                <ion-icon name="checkmark-circle" class="status-icon"></ion-icon>
                <p>Upload complete!</p>
                <ion-button (click)="reset()" fill="outline" expand="block">
                  Upload Another
                </ion-button>
              </div>
            }

            @case ('error') {
              <div class="upload-error">
                <ion-icon name="close-circle" class="status-icon"></ion-icon>
                <p>Upload failed. Please try again.</p>
                <ion-button (click)="reset()" fill="outline" expand="block">
                  Try Again
                </ion-button>
              </div>
            }
          }
        </div>
      </div>
    </app-comp-page-layout>
  `,
  styles: `
    .page-content {
      color: var(--ion-color-light);
    }

    h1 {
      color: var(--ion-color-primary);
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .input-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 24px;
    }

    .input-item {
      --background: var(--app-input-bg);
      --border-color: var(--app-border-soft);
      --border-radius: 8px;
      --padding-start: 12px;
      --inner-padding-end: 12px;
      border-radius: 8px;
      margin-bottom: 4px;
    }

    .field-error {
      color: var(--ion-color-danger);
      font-size: 12px;
      margin: 0 0 4px 0;
      padding-left: 12px;
    }

    .field-hint {
      color: var(--ion-color-medium);
      font-size: 12px;
      margin: 0 0 12px 0;
      padding-left: 12px;
    }

    .required {
      color: var(--ion-color-danger);
    }

    .upload-zone {
      border: 2px dashed var(--app-border-soft);
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      transition: border-color 0.2s, background 0.2s;
    }

    .upload-zone--active {
      border-color: var(--ion-color-primary);
      background: var(--app-glow-cyan);
    }

    .file-input {
      display: none;
    }

    .upload-icon {
      font-size: 64px;
      color: var(--ion-color-primary);
      margin-bottom: 16px;
      opacity: 0.7;
    }

    .upload-hint {
      color: var(--ion-color-medium);
      margin: 0 0 24px 0;
    }

    .file-name {
      color: var(--ion-color-light);
      font-weight: 500;
      margin: 0 0 4px 0;
      word-break: break-all;
    }

    .file-size {
      color: var(--ion-color-medium);
      margin: 0 0 24px 0;
    }

    .upload-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    ion-progress-bar {
      width: 100%;
      max-width: 300px;
      --background: var(--ion-color-step-200);
      --progress-background: var(--ion-color-primary);
      border-radius: 4px;
      height: 8px;
    }

    .progress-text {
      color: var(--ion-color-medium);
      margin: 0;
      font-size: 14px;
    }

    .status-icon {
      font-size: 56px;
      margin-bottom: 12px;
    }

    .upload-success .status-icon {
      color: var(--ion-color-success);
    }

    .upload-error .status-icon {
      color: var(--ion-color-danger);
    }
  `,
})
export class UploadItemPage {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  Math = Math;

  state: UploadState = 'idle';
  selectedFile: File | null = null;
  uploadProgress = 0;

  name = '';
  collection = '';
  nameError = '';
  collectionError = '';

  private static readonly SLASH_PATTERN = /[\\/]/;

  get canUpload(): boolean {
    return (
      this.name.trim().length > 0 &&
      !UploadItemPage.SLASH_PATTERN.test(this.name) &&
      !UploadItemPage.SLASH_PATTERN.test(this.collection) &&
      this.selectedFile !== null
    );
  }

  validateField(field: 'name' | 'collection'): void {
    const value = this[field];
    if (UploadItemPage.SLASH_PATTERN.test(value)) {
      this[`${field}Error`] = 'Slashes ( / or \\ ) are not allowed.';
    } else {
      this[`${field}Error`] = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.state = 'selected';
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.state = 'idle';
    this.resetFileInput();
  }

  upload(): void {
    if (!this.selectedFile) {
      return;
    }
    this.state = 'uploading';
    this.uploadProgress = 0;

    // Placeholder: simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress = Math.min(this.uploadProgress + 0.05, 0.95);
    }, 100);

    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      this.uploadProgress = 1;
      // Simulate success (swap to error to test failure state)
      this.state = 'success';
    }, 2000);
  }

  reset(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.state = 'idle';
    this.name = '';
    this.collection = '';
    this.nameError = '';
    this.collectionError = '';
    this.resetFileInput();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
