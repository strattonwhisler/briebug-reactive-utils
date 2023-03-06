import { StringParser, StringPrinter } from './models';
import { PersistenceAdapter } from './persistence-adapter';
import { safeStringParse } from './utils';

/**
 * Persists values using the Web Storage API
 *
 * @param storage The storage object to store values in
 * @param key Key to store the value under
 * @param print Printer to use when writing the value
 * @param parse Parser to use when reading the value
 */
export const storageAdapter = <T>(
  storage: Storage,
  key: string,
  print: StringPrinter<T> = JSON.stringify,
  parse: StringParser<T> = JSON.parse
): PersistenceAdapter<T> => ({
  async read(): Promise<T | undefined> {
    return safeStringParse(storage.getItem(key), parse);
  },

  async write(value: T): Promise<void> {
    storage.setItem(key, print(value));
  },

  async clear(): Promise<void> {
    storage.removeItem(key);
  },
});

/**
 * Persists values using localStorage
 *
 * @param key Key to store the value under
 * @param print Printer to use when writing the value
 * @param parse Parser to use when reading the value
 */
export const localStorageAdapter = <T>(
  key: string,
  print?: StringPrinter<T>,
  parse?: StringParser<T>
): PersistenceAdapter<T> => storageAdapter(localStorage, key);

/**
 * Persists values using sessionStorage
 *
 * @param key Key to store the value under
 * @param print Printer to use when writing the value
 * @param parse Parser to use when reading the value
 */
export const sessionStorageAdapter = <T>(
  key: string,
  print?: StringPrinter<T>,
  parse?: StringParser<T>
): PersistenceAdapter<T> => storageAdapter(sessionStorage, key);

const promiseFromEvents = <TTarget extends EventTarget, TMap extends Record<string, Event>>(
  target: TTarget,
  resolveType: keyof TMap,
  rejectType: keyof TMap
): Promise<TMap[typeof resolveType]> => {
  const controller = new AbortController();
  return new Promise<TMap[typeof resolveType]>((resolve, reject) => {
    target.addEventListener(resolveType, resolve, {
      once: true,
      signal: controller.signal,
    });
    target.addEventListener(rejectType, reject, {
      once: true,
      signal: controller.signal,
    });
  })
    .finally(() => controller.abort());
}

const transaction = <T>(requestFn: () => IDBRequest<T>): Promise<T> => {
  const request = requestFn();
  return promiseFromEvents(request, 'success', 'error').then(() => request.result);
};

/**
 * Persists values using the IndexedDB API
 */
export const indexedDbAdapter = <T>(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey
): PersistenceAdapter<T> => ({
  async read(): Promise<T> {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return transaction(() => store.get(key));
  },

  async write(value: T): Promise<void> {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await transaction(() => store.put(value, key));
  },

  async clear(): Promise<void> {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await transaction(() => store.delete(key));
  },
});

export interface CookieOptions {
  domain?: string;
  expires?: Date;
  maxAge?: number;
  partitioned?: boolean;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

/**
 * Persists values using cookies
 *
 * @param name Name of the cookie
 * @param options Cookie options to use when writing the cookie
 * @param print Printer to use when writing the value
 * @param parse Parser to use when reading the value
 */
export const cookieAdapter = <T>(
  name: string,
  options?: CookieOptions,
  print: StringPrinter<T> = JSON.stringify,
  parse: StringParser<T> = JSON.parse
): PersistenceAdapter<T> => {
  const cookieRegex: RegExp = /a/;

  const writeCookie = (value: string, options?: CookieOptions) => {
    document.cookie = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      options?.domain ? `domain=${encodeURIComponent(options.domain)}` : [],
      options?.expires ? `expires=${options.expires.toUTCString()}` : [],
      options?.maxAge ? `max-age=${options.maxAge}` : [],
      options?.partitioned ? 'partitioned' : [],
      options?.path ? `path=${encodeURIComponent(options.path)}` : [],
      options?.sameSite ? `samesite=${options.sameSite}` : [],
      options?.secure ? 'secure' : [],
    ]
      .flat()
      .join('; ');
  };

  return {
    async read(): Promise<T> {
      const result = cookieRegex.exec(document.cookie);
      return safeStringParse(result?.[0], (value) =>
        parse(decodeURIComponent(value))
      );
    },

    async write(value: T): Promise<void> {
      writeCookie(print(value), options);
    },

    async clear(): Promise<void> {
      writeCookie('', { ...options, expires: new Date(0) });
    },
  };
};

// /**
//  * Persists values using the Cookie Store API
//  *
//  * @param name Name of the cookie
//  * @param options Cookie options to use when writing the cookie
//  * @param print Printer to use when writing the value
//  * @param parse Parser to use when reading the value
//  */
// export const cookieStoreAdapter = <T>(
//     name: string,
//     options?: CookieOptions,
//     print: StringPrinter<T> = JSON.stringify,
//     parse: StringParser<T> = JSON.parse
// ): PersistenceAdapter<T> => ({
//     async read(): Promise<T> {
//         return parse(await cookieStore.get(name));
//     },
//     async write(value: T): Promise<T> {
//         await cookieStore.set({
//             name,
//             value: print(value),
//             ...options
//         });
//         return value;
//     },
//     async clear(): Promise<void> {
//         await cookieStore.delete(name);
//     }
// });
