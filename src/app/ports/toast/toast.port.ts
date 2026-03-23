import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastPort {
  private toastController: ToastController;
  private readonly defaultDuration = 1500;
  private readonly defaultPosition = 'top';

  constructor() {
    this.toastController = new ToastController();
  }

  async error(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: this.defaultDuration,
      position: this.defaultPosition,
      color: 'danger',
    });

    await toast.present();
  }

  async success(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: this.defaultDuration,
      position: this.defaultPosition,
      color: 'success',
    });

    await toast.present();
  }

  async info(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: this.defaultDuration,
      position: this.defaultPosition,
      color: 'primary',
    });

    await toast.present();
  }

  async warning(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: this.defaultDuration,
      position: this.defaultPosition,
      color: 'warning',
    });

    await toast.present();
  }
}
