import {Injectable} from '@angular/core';
import {ItemEntity, ItemType} from '@features/item/item.types';

@Injectable({providedIn: 'root'})
export class UtilItemService {
  private static readonly SLASH_PATTERN = /[\\/]/;

  hasSlashesCheck(value: string): boolean {
    return UtilItemService.SLASH_PATTERN.test(value);
  }

  getItemType(item: ItemEntity): ItemType {
    if (item.id === undefined || item.id === null) return ItemType.COLLECTION;
    if (item.mime_type?.startsWith('video/')) return ItemType.VIDEO;
    return ItemType.IMAGE;
  }

  getItemIcon(item: ItemEntity): string {
    switch (this.getItemType(item)) {
      case ItemType.COLLECTION:
        return 'folder';
      case ItemType.VIDEO:
        return 'videocam';
      case ItemType.IMAGE:
        return 'image';
      default:
        return '';
    }
  }

  formatFileSize(bytes?: number): string {
    if (bytes === undefined || bytes === null) return '';

    if (bytes === 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }
}
