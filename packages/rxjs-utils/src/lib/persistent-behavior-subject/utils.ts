import { StringParser } from "./models";

export const safeStringParse = <T>(value: string | null | undefined, parse: StringParser<T>): T | undefined =>
  value === null || value === undefined ? undefined : parse(value);
