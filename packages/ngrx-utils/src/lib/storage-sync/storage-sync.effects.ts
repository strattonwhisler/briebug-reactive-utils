import { Inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { notOfType } from './not-of-type.operator';
import { STATE_RESTORED } from './storage-sync.actions';
import {
  DEFAULT_STORAGE_KEY,
  StoreSyncConfig,
  STORE_SYNC_CONFIG,
} from './storage-sync.config';
import { StorageSyncService } from './storage-sync.service';
import { buildRestoreableState, getStorableState } from './utils';

@Injectable()
export class StorageSyncEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly storage: StorageSyncService,
    @Inject(STORE_SYNC_CONFIG)
    private config: StoreSyncConfig
  ) {}

  updateStateStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        notOfType(
          ROOT_EFFECTS_INIT,
          STATE_RESTORED,
          ...(this.config.ignoredActions || [])
        ),
        filter(() => !!this.config.keys),
        withLatestFrom(
          this.store.select((state) => state),
          this.actions$.pipe(ofType(STATE_RESTORED))
        ),
        map(([action, currentState]) =>
          getStorableState(currentState, this.config.keys)
        ),
        switchMap((storableState) =>
          this.storage.set(
            this.config.storageKey || DEFAULT_STORAGE_KEY,
            storableState
          )
        )
      ),
    { dispatch: false }
  );

  restoreStateStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => (this.storage.create ? this.storage.create() : of(null))),
      filter(() => !!this.config.keys),
      switchMap(() =>
        this.storage.get(this.config.storageKey || DEFAULT_STORAGE_KEY)
      ),
      map((foundState) =>
        foundState ? buildRestoreableState(foundState, this.config.keys) : {}
      ),
      map((restoredState) => STATE_RESTORED({ restoredState }))
    )
  );
}
