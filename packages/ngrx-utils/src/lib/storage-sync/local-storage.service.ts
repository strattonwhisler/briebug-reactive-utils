import { Injectable } from '@angular/core';
import { StorageSyncService } from './storage-sync.service';

@Injectable()
export class LocalStorageService extends StorageSyncService {
  async set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  async get(key: string) {
    localStorage.getItem(key);
  }
}
