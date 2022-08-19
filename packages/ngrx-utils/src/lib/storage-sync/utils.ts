import { SyncKeyMap } from './storage-sync.config';

export const getRestorationState = (state: any, key: string, keyMap: SyncKeyMap): any =>
  typeof keyMap[key] === 'object' ? buildRestoreableState(state[key], keyMap[key] as SyncKeyMap) : state[key];

export const buildRestoreableState = (state: any, keys: SyncKeyMap) =>
  Object.keys(state).reduce(
    (restoredState: any, key: string) =>
      keys[key] === true || typeof keys[key] === 'object'
        ? { ...restoredState, [key]: getRestorationState(state, key, keys) }
        : restoredState,
    {}
  );

export const getStorableState = (state: any, keys: SyncKeyMap) =>
  Object.keys(state).reduce(
    (restoredState: any, key: string) =>
      keys[key] === true || typeof keys[key] === 'object'
        ? { ...restoredState, [key]: getRestorationState(state, key, keys) }
        : restoredState,
    {}
  );
