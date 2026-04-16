import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';
import {PageLayoutComponent} from '@features/master/components/page-layout.component';
import {firstValueFrom} from 'rxjs';
import {UploadItemService} from '@features/item/services/upload-item.service';
import {UtilItemService} from '@features/item/services/util-item.service';

enum UploadState {
  IDLE = 'idle',
  SELECTED = 'selected',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface FileTypeConfig {
  accept: string;
  icon: string;
  buttonIcon: string;
  label: string;
  selectButtonText: string;
  idleHint: string;
}

const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  video: {
    accept: 'video/*',
    icon: 'videocam',
    buttonIcon: 'videocam',
    label: 'Video',
    selectButtonText: 'Select Video',
    idleHint: 'Select a video file to upload',
  },
  image: {
    accept: 'image/*',
    icon: 'image',
    buttonIcon: 'image',
    label: 'Image',
    selectButtonText: 'Select Image',
    idleHint: 'Select an image file to upload',
  },
};

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
    IonSelect,
    IonSelectOption,
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

          <ion-item class="input-item">
            <ion-select
              label="File Type"
              labelPlacement="stacked"
              [(ngModel)]="selectedFileType"
              (ionChange)="onFileTypeChange()"
              interface="popover"
            >
              @for (option of fileTypeOptions; track option) {
                <ion-select-option [value]="option">
                  {{ FILE_TYPE_CONFIGS[option].label }}
                </ion-select-option>
              }
            </ion-select>
          </ion-item>
        </div>

        <div
          class="upload-zone"
          [class.upload-zone--active]="state === UploadState.SELECTED"
        >
          <input
            #fileInput
            type="file"
            [accept]="fileTypeConfig.accept"
            (change)="onFileSelected($event)"
            class="file-input"
          />

          @switch (state) {
            @case (UploadState.IDLE) {
              <div class="upload-idle">
                <ion-icon [name]="fileTypeConfig.icon" class="upload-icon"></ion-icon>
                <p class="upload-hint">{{ fileTypeConfig.idleHint }}</p>
                <ion-button (click)="fileInput.click()" expand="block">
                  <ion-icon [name]="fileTypeConfig.buttonIcon" slot="start"></ion-icon>
                  {{ fileTypeConfig.selectButtonText }}
                </ion-button>
              </div>
            }

            @case (UploadState.SELECTED) {
              <div class="upload-selected">
                <ion-icon [name]="fileTypeConfig.icon" class="upload-icon"></ion-icon>
                <p class="file-name">{{ selectedFile?.name }}</p>
                <p class="file-size">{{ utilItemService.formatFileSize(selectedFile?.size ?? 0) }}</p>
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

            @case (UploadState.UPLOADING) {
              <div class="upload-progress">
                <p class="file-name">{{ selectedFile?.name }}</p>
                <ion-progress-bar [value]="uploadProgress" type="determinate"></ion-progress-bar>
                <p class="progress-text">{{ Math.round(uploadProgress * 100) }}%</p>
              </div>
            }

            @case (UploadState.SUCCESS) {
              <div class="upload-success">
                <ion-icon name="checkmark-circle" class="status-icon"></ion-icon>
                <p>Upload complete!</p>
                <ion-button (click)="reset()" fill="outline" expand="block">
                  Upload Another
                </ion-button>
              </div>
            }

            @case (UploadState.ERROR) {
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

  private uploadService = inject(UploadItemService);

  utilItemService = inject(UtilItemService);

  Math = Math;
  FILE_TYPE_CONFIGS = FILE_TYPE_CONFIGS;
  UploadState = UploadState;

  state: UploadState = UploadState.IDLE;
  selectedFile: File | null = null;
  uploadProgress = 0;

  name = '';
  collection = '';
  nameError = '';
  collectionError = '';

  fileTypeOptions = Object.keys(FILE_TYPE_CONFIGS);
  selectedFileType: string = 'video';

  get fileTypeConfig(): FileTypeConfig {
    return FILE_TYPE_CONFIGS[this.selectedFileType];
  }

  get canUpload(): boolean {
    return (
      this.name.trim().length > 0 &&
      !this.utilItemService.hasSlashesCheck(this.name) &&
      !this.utilItemService.hasSlashesCheck(this.collection) &&
      this.selectedFile !== null
    );
  }

  validateField(field: 'name' | 'collection'): void {
    const value = this[field];

    this[`${field}Error`] = this.utilItemService.hasSlashesCheck(value)
      ? 'Slashes ( / or \\ ) are not allowed.'
      : '';
  }

  onFileTypeChange(): void {
    this.clearSelection();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.state = UploadState.SELECTED;
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.state = UploadState.IDLE;
    this.resetFileInput();
  }

  async upload(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }
    this.state = UploadState.UPLOADING;
    this.uploadProgress = 0;

    try {
      const signedUrl$ = await this.uploadService.makeSignedUploadUrl(
        this.name,
        this.collection.trim() || undefined,
      );

      const signedUrl = await firstValueFrom(signedUrl$);

      if (!signedUrl) {
        this.uploadProgress = 0;
        this.state = UploadState.ERROR;
        return;
      }

      this.uploadProgress = 0.5;

      const success = await this.uploadService.uploadItemToSignedUploadUrl(
        signedUrl,
        this.selectedFile!,
      );

      if (success) {
        this.uploadProgress = 1;
        this.state = UploadState.SUCCESS;
        this.reset();
      } else {
        this.uploadProgress = 0;
        this.state = UploadState.ERROR;
      }
    } catch {
      this.uploadProgress = 0;
      this.state = UploadState.ERROR;
    }
  }

  reset(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.state = UploadState.IDLE;
    this.name = '';
    this.collection = '';
    this.nameError = '';
    this.collectionError = '';
    this.selectedFileType = 'video';
    this.resetFileInput();
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
