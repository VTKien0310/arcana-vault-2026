import {Injectable} from '@angular/core';
import {ItemEntity} from '@features/item/types/item.types';

@Injectable({providedIn: 'root'})
export class UtilItemService {
  private static readonly SLASH_PATTERN = /[\\/]/;

  hasSlashesCheck(value: string): boolean {
    return UtilItemService.SLASH_PATTERN.test(value);
  }

  getItemIcon(item: ItemEntity): string {
    if (item.id === null) return 'folder';
    if (item.mime_type?.startsWith('video/')) return 'videocam';
    return 'image';
  }

  formatFileSize(bytes?: number): string {
    if (bytes === undefined || bytes === null) return 'N/A';

    if (bytes === 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }
}
