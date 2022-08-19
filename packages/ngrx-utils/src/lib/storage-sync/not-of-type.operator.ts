import { Action, ActionCreator, Creator } from '@ngrx/store';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

export const notOfType = (
  ...allowedTypes: Array<string | ActionCreator<string, Creator>>
): MonoTypeOperatorFunction<Action> =>
  filter(
    (action: Action) =>
      !allowedTypes.some((typeOrActionCreator: string | ActionCreator<string, Creator>) =>
        typeof typeOrActionCreator === 'string'
          ? typeOrActionCreator === action.type
          : typeOrActionCreator.type === action.type
      )
  );
