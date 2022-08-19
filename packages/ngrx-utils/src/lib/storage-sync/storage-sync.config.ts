import { InjectionToken, Provider } from '@angular/core';
import { ActionCreator, Creator } from '@ngrx/store';

export const STORE_SYNC_CONFIG = new InjectionToken('storeSyncConfig');

export interface SyncKeyMap {
  [key: string]: boolean | SyncKeyMap;
}

export const DEFAULT_STORAGE_KEY = '__StorageSync';

export interface StoreSyncConfig {
  ignoredActions: Array<string | ActionCreator<string, Creator>>;
  storageKey: string;
  keys: SyncKeyMap;
  hydrationKey: string;
}

export const storageSyncConfig = Symbol('StorageSyncConfig');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function storageSyncConfigFactory(config: Partial<StoreSyncConfig>) {
  // @ts-ignore
  storageSyncConfigFactory[storageSyncConfig] = config;
  return () => config;
}

export const createStorageSyncConfig = (config: Partial<StoreSyncConfig>): Provider => ({
  provide: STORE_SYNC_CONFIG,
  useFactory: storageSyncConfigFactory(config),
});
