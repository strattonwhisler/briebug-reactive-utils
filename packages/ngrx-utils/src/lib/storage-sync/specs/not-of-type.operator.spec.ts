import { createAction } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { notOfType } from '../not-of-type.operator';

describe('notOfType', () => {
  const PRIMARY_ACTION_STRING = '[Test] (Primary) Mock Action Event';
  const primaryMockAction = createAction(PRIMARY_ACTION_STRING);
  const SECONDARY_ACTION_STRING = '[Test] (Secondary) Mock Action Event';
  const secondaryMockAction = createAction(SECONDARY_ACTION_STRING);

  it('should filter an observable stream to only allow non matching actions through by actionCreator', () => {
    const stream = hot('-a-b-c-d', {
      a: primaryMockAction(),
      b: secondaryMockAction(),
      c: primaryMockAction(),
      d: secondaryMockAction(),
    });
    const expected = hot('-a---c-', {
      a: primaryMockAction(),
      c: primaryMockAction(),
    });

    const res = stream.pipe(notOfType(secondaryMockAction));

    expect(res).toBeObservable(expected);
  });

  it('should filter an observable stream to only allow non matching actions through by string', () => {
    const stream = hot('-a-b-c-d', {
      a: primaryMockAction(),
      b: secondaryMockAction(),
      c: primaryMockAction(),
      d: secondaryMockAction(),
    });
    const expected = hot('-a---c-', {
      a: primaryMockAction(),
      c: primaryMockAction(),
    });

    const res = stream.pipe(notOfType(SECONDARY_ACTION_STRING));

    expect(res).toBeObservable(expected);
  });
});
