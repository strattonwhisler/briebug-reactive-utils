import {
  RouterNavigatedAction,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const extractRouterState = () =>
  map((r: RouterNavigatedAction) => r.payload.routerState);

// TODO: Refactor to use this as operator factory?
export const createUrlFilterOperator = <T>(comparator: (routerUrl: string, inputUrl: T) => boolean) => (...urls: T[]) =>
  pipe(
    extractRouterState(),
    filter(({ url }: SerializedRouterStateSnapshot) =>
      urls.some((inputUrl) => comparator(url, inputUrl))
    )
  );

export const routeIncludesPath = (...urls: string[]) =>
  pipe(
    extractRouterState(),
    filter((routerState: SerializedRouterStateSnapshot) =>
      urls.some((url) => routerState.url.includes(url))
    )
  );

export const routeEndsInPath = (...urls: string[]) =>
  pipe(
    extractRouterState(),
    filter((routerState: SerializedRouterStateSnapshot) =>
      urls.some((url) => routerState.url.endsWith(url))
    )
  );

export const routeStartsWithPath = (...urls: string[]) =>
  pipe(
    extractRouterState(),
    filter((routerState: SerializedRouterStateSnapshot) =>
      urls.some((url) => routerState.url.startsWith(url))
    )
  );

export const routeMatchesRegExp = (...urlExps: RegExp[]) =>
  pipe(
    extractRouterState(),
    filter((routerState: SerializedRouterStateSnapshot) =>
      urlExps.some((urlExp) => urlExp.test(routerState.url))
    )
  );

export const extractParameter = (param: string) =>
  map(
    ({ root: { firstChild } }: SerializedRouterStateSnapshot) =>
      firstChild?.firstChild?.params[param]
  );

export const extractVerifiedParameter = (param: string) =>
  pipe(
    extractParameter(param),
    filter((p) => !!p)
  );
