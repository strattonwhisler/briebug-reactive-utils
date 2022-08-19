import { createAction } from '@ngrx/store';
import { STATE_RESTORED } from '../storage-sync.actions';
import { storageSyncReducer } from '../storage-sync.reducer';

describe('storageSyncReducer', () => {
  const PRIMARY_ACTION_STRING = '[Test] (Primary) Mock Action Event';
  const primaryMockAction = createAction(PRIMARY_ACTION_STRING);

  it('should merge the restoredState and set the hydrated key if the action is STATE_RESTORED', () => {
    const state = { someState: 'Some State' };
    const restoredState = { extraState: 'Some Extra State' };
    const action = STATE_RESTORED({ restoredState });
    const reducer = jest.fn();

    const reductionFn = storageSyncReducer(reducer);

    const res = reductionFn(state, action);

    expect(reducer).toBeCalledWith(
      {
        ...state,
        ...restoredState,
        hydrated: true,
      },
      action
    );
  });

  it('should not merge the restoredState or set the hydrated key if the action is not STATE_RESTORED', () => {
    const state = { someState: 'Some State' };
    const action = primaryMockAction();
    const reducer = jest.fn();
    const reductionFn = storageSyncReducer(reducer);

    const res = reductionFn(state, action);

    expect(reducer).toBeCalledWith(
      {
        ...state,
      },
      action
    );
  });
});
