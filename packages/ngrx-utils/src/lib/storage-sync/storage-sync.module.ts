import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageService } from './local-storage.service';
import { createStorageSyncConfig, StoreSyncConfig } from './storage-sync.config';
import { StorageSyncEffects } from './storage-sync.effects';
import { StorageSyncService } from './storage-sync.service';

@NgModule({
  imports: [EffectsModule.forFeature([StorageSyncEffects])],
})
export class StorageSyncModule {
  static forRoot(config: Partial<StoreSyncConfig>): ModuleWithProviders<StorageSyncModule> {
    return {
      ngModule: StorageSyncModule,
      providers: [
        createStorageSyncConfig(config),
        { provide: StorageSyncService, useClass: LocalStorageService }
      ],
    };
  }
}
