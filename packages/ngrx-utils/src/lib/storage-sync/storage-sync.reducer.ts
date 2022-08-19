import { MetaReducer } from '@ngrx/store';
import { STATE_RESTORED } from './storage-sync.actions';
import { storageSyncConfig, storageSyncConfigFactory } from './storage-sync.config';

// TODO: Better way than using ts-ignore?
// @ts-ignore
const resolveHydrationKey = () => storageSyncConfigFactory[storageSyncConfig]?.hydrationKey || 'hydrated';

export const storageSyncReducer: MetaReducer = reducer => (state, action) =>
  reducer(
    action.type === STATE_RESTORED.type
      ? { ...state, ...(action as any).restoredState, [resolveHydrationKey()]: true }
      : state,
    action
  );
