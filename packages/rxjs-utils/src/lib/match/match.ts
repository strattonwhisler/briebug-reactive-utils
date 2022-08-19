import { defer, EMPTY, from, Observable, ObservableInput, SubscribableOrPromise } from 'rxjs';

export interface MatchOperatorOutcome {
  op: string;
  comparable: boolean;
  recursive?: boolean;
  result: any | any[];
}

export type BooleanFunction = <V extends unknown>(v?: V) => boolean;
export type StringFunction = <V extends unknown>(v?: V) => string;
export type NumberFunction = <V extends unknown>(v?: V) => number;
export type ObjectFunction = <V extends unknown>(v?: V) => Record<string, unknown>;
export type ArrayFunction = <V extends unknown>(v?: V) => Array<any>;
export type RegExpFunction = <V extends unknown>(v?: V) => RegExp;
export type OperatorFunction = <V extends unknown>(v?: V) => MatchOperatorOutcome;
export type MatchGeneralFunction = (v?: any) => any;
export type MatchFunctionOutcome =
  BooleanFunction | StringFunction | NumberFunction | ObjectFunction | ArrayFunction | RegExpFunction | OperatorFunction;
export type MatchOutcome =
// eslint-disable-next-line @typescript-eslint/ban-types
  boolean | string | number | Record<string, unknown> | Array<any> | RegExp | Symbol | MatchFunctionOutcome;


export const resultsHaveMatch = (allMatch: boolean | null, wasMatch: boolean | null): boolean | null =>
  allMatch === null ? wasMatch : allMatch && wasMatch

export const isObjectMatch = <V extends unknown>(
  value: Record<string, unknown>,
  outcome: Record<string, unknown>
): boolean | null =>
  Object.keys(outcome)
    .map(key => {
      const out = outcome[key];
      if (typeof out === 'function') {
        const result = out(value[key]);
        if (typeof result === 'boolean') {
          return result;
        }
        return isMatch(value[key], result); // eslint-disable-line
      }
      return isMatch(value[key], out as MatchOutcome); // eslint-disable-line
    })
    .reduce(resultsHaveMatch, null);

export const isArrayMatch = <V extends unknown>(value: any[], outcome: any[]): boolean | null => outcome
    .map((out, index) => {
      if (typeof out === 'function') {
        const result = out(value[index]);
        if (typeof result === 'boolean') {
          return result;
        }
        return isMatch(value[index], result); // eslint-disable-line
      }
      return isMatch(value[index], out); // eslint-disable-line
    })
    .reduce(resultsHaveMatch, null);

export const isOtherMatch = <V extends unknown>(value: V, outcome: MatchOutcome): boolean | null => {
  if (value instanceof Date && outcome instanceof Date) {
    return value === outcome;
  }

  if (value instanceof Array && outcome instanceof Array) {
    return isArrayMatch(value, outcome);
  }

  return isObjectMatch(value as any, outcome as Record<string, unknown>);
};

export const isOperatorMatch = <V extends unknown>(value: V, outcome: MatchOperatorOutcome): boolean =>
  outcome.comparable
    ? value === outcome.result
    : outcome.recursive && Array.isArray(outcome.result)
    ? outcome.result.map((cmp: any) => isMatch(value, cmp)).reduce((finalMatch, wasMatch) => // eslint-disable-line
      finalMatch === null
        ? wasMatch
        : outcome.op === 'some'
        ? finalMatch || wasMatch
        : finalMatch && wasMatch,
      null
    )
    : outcome.result;

export const isMatch = <V extends unknown>(value: V, outcome: MatchOutcome): boolean | null => {
  if (typeof outcome === 'function') {
    outcome = (outcome as MatchGeneralFunction)(value) as MatchOutcome;
    if (typeof outcome === 'boolean') {
      return outcome;
    }
  }

  if (!!outcome && (outcome as any).op != null) {
    return isOperatorMatch(value, outcome as any as MatchOperatorOutcome);
  }

  switch (typeof outcome) {
    case 'boolean':
    case 'string':
    case 'number':
      return value === outcome;
    case 'undefined':
      return value === undefined;
    case 'object':
      return isOtherMatch(value, outcome);
  }
  return null;
};

const getMatchedObs = <V>(value: V, when: (value: V) => [MatchOutcome, ObservableInput<any>]): ObservableInput<any> | null => {
  const [outcome, sop] = when(value);
  const matched = isMatch(value, outcome);
  return matched ? sop : null;
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function match<V>(
  getValue: () => V,
  ...whens: Array<(value: V) => [MatchOutcome, ObservableInput<any>]>
): Observable<any> {
  return defer(() => {
    const value = getValue();

    const matchedObs = whens.reduce((matched: ObservableInput<any> | null, when) =>
        !!matched ? matched : getMatchedObs(value, when)
      , null);

    return matchedObs || EMPTY;
  });
}

export const floor = Math.floor;
export const abs = Math.abs;

export const sign = (x: any) =>
  x < 0 ? -1 : 1;

export const toInteger = (x: any) =>
  (x !== x)
    ? 0
    : (x === 0 || x === -Infinity || x === Infinity)
    ? x
    : sign(x) * floor(abs(x));

match.isAnything = () => ({op: 'isAnything', comparable: false, result: true});
match.anything = match.isAnything;


match.some = (comparisons: any[]) => ({op: 'some', comparable: false, recursive: true, result: comparisons});
match.all = (comparisons: any[]) => ({op: 'all', comparable: false, recursive: true, result: comparisons});

match.isPrimitive = <V extends unknown>(v?: V) => ({op: 'isPrimitive', comparable: false, result: v === null || typeof v !== 'object'});
match.primitives = match.isPrimitive;
match.isObject = <V extends unknown>(v?: V) => ({op: 'isObject', comparable: false, result: typeof v === 'object'});
match.objects = match.isObject;
match.isFunction = <V extends unknown>(v?: V) => ({op: 'isFunction', comparable: false, result: typeof v === 'function'});
match.functions = match.isFunction;
match.isNumber = <V extends unknown>(v?: V) => ({op: 'isNumber', comparable: false, result: typeof v === 'number'});
match.numbers = match.isNumber;
match.isString = <V extends unknown>(v?: V) => ({op: 'isString', comparable: false, result: typeof v === 'string'});
match.strings = match.isString;
match.isNull = <V extends unknown>(v?: V) => ({op: 'isNull', comparable: false, result: typeof v === null});
match.null = match.isNull;
match.isUndefined = <V extends unknown>(v?: V) => ({op: 'isUndefined', comparable: false, result: typeof v === undefined});
// eslint-disable-next-line
match.undefined = match.isUndefined;
match.isNullish = <V extends unknown>(v?: V) => ({op: 'isNullish', comparable: false, result: typeof v == null});
match.nullish = match.isNullish;
match.isFalsy = <V extends unknown>(v?: V) => ({op: 'isFalsy', comparable: false, result: !v});
match.falsy = match.isFalsy;
match.isTruthy = <V extends unknown>(v?: V) => ({op: 'isTruthy', comparable: false, result: !!v});
match.truthy = match.isTruthy;
match.isBoolean = <V extends unknown>(v?: V) => ({op: 'isBoolean', comparable: false, result: typeof v === 'boolean'});
match.booleans = match.isBoolean;
match.isInteger = <V extends unknown>(v?: V) => ({op: 'isInteger', comparable: false, result: typeof v === 'number' && toInteger(v)});
match.integers = match.isInteger;
match.isNegative = <V extends unknown>(v?: V) => ({op: 'isNegative', comparable: false, result: typeof v === 'number' && v < 0});
match.negativeNumbers = match.isNegative;
match.isPositive = <V extends unknown>(v?: V) => ({op: 'isPositive', comparable: false, result: typeof v === 'number' && v > 0});
match.positiveNumbers = match.isPositive;
match.isNonNegative = <V extends unknown>(v?: V) => ({op: 'isNonNegative', comparable: false, result: typeof v === 'number' && v >= 0});
match.nonNegativeNumbers = match.isNonNegative;
match.isMinusZero = <V extends unknown>(v?: V) => ({
  op: 'isNonNegative',
  comparable: false,
  result: typeof v === 'number' && v === 0 && 1 / v === -Infinity
});
match.minusZero = match.isMinusZero;
match.isPlusZero = <V extends unknown>(v?: V) => ({
  op: 'isNonNegative',
  comparable: false,
  result: typeof v === 'number' && v === 0 && 1 / v === Infinity
});
match.plusZero = match.isPlusZero;
match.isFinite = <V extends unknown>(v?: V) => ({op: 'isFinite', comparable: false, result: typeof v === 'number' && isFinite(v)});
match.finiteNumbers = match.isFinite;
match.isInfinite = <V extends unknown>(v?: V) => ({
  op: 'isInfinite',
  comparable: false,
  result: typeof v === 'number' && (v === Infinity || v === -Infinity)
});
match.infiniteNumbers = match.isInfinite;

match.gt = (c: string | number | Date) =>
  (v?: string | number | Date) => v !== undefined && v > c;
match.lt = (c: string | number | Date) =>
  (v?: string | number | Date) => v !== undefined && v < c;
match.gte = (c: string | number | Date) =>
  (v?: string | number | Date) => v !== undefined && v >= c;
match.lte = (c: string | number | Date) =>
  (v?: string | number | Date) => v !== undefined && v <= c;

match.startsWith = (c: string) =>
  (v?: string) => typeof v === 'string' && v.startsWith(c);
match.endsWith = (c: string) =>
  (v?: string) => typeof v === 'string' && v.endsWith(c);
match.includesString = (c: string, pos = 0) =>
  (v?: string) => typeof v === 'string' && v.includes(c, pos);
match.regex = (c: RegExp) =>
  (v?: string) => typeof v === 'string' && c.test(v);

match.instanceOf = (c: any) =>
  (v?: any) => v instanceof c;
match.typeOf = (c: string) =>
  (v?: any) => typeof v === c;
