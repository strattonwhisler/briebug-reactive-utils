import { createAction, props } from '@ngrx/store';

export const STATE_RESTORED = createAction('@briebug/storage-sync/state-restored', props<{ restoredState: any }>());
