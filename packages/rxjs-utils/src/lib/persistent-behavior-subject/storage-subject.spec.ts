import {
    PersistentBehaviorSubject
} from './storage-subject';
import {
    cookieAdapter,
    cookieStoreAdapter,
    indexedDbAdapter,
    localStorageAdapter,
    sessionStorageAdapter
} from "./dom.adapters";
import { ionicStorageAdapter } from "./ionic.adapters";
import { capacitorPreferencesAdapter } from "./capacitor.adapters";
import { memoryAdapter } from "./adapters";
import { PersistenceAdapter } from "./persistence-adapter";
import { identity } from "rxjs";

describe('localStorageAdapter', () => {
  let adapter: PersistenceAdapter<string>;

  beforeEach(() => {
    localStorage.clear();
    adapter = localStorageAdapter('test-key');
  });

  it('should read from localStorage', async () => {
    localStorage.setItem('test-key', '"test-value"');
    expect(await adapter.read()).toEqual('test-value');
  });

  it('should write to localStorage', async () => {
    await adapter.write('test-value');
    expect(localStorage.getItem('test-key')).toEqual('"test-value"');
  });

  it('should clear the key from localStorage', async () => {
    localStorage.setItem('test-key', '"test-value"');
    localStorage.setItem('test-key2', '"test-value"');
    await adapter.clear();
    expect(localStorage.getItem('test-key')).toBeNull();
    expect(localStorage.getItem('test-key2')).toEqual('"test-value"');
  });

  it('should support custom printers and parsers', () => {
    adapter = localStorageAdapter('test-key', identity, identity);
    adapter.write('test-value');
    expect(localStorage.getItem('test-key')).toEqual('test-value');
    expect(adapter.read()).toEqual('test-value');
  });
});

const localStorage$ = new PersistentBehaviorSubject('local', localStorageAdapter('some-key'));

const sessionStorage$ = new PersistentBehaviorSubject('session', sessionStorageAdapter('some-key'));

const cookie$ = new PersistentBehaviorSubject('cookie', cookieAdapter('some-name'));

const cookieStore$ = new PersistentBehaviorSubject('cookie', cookieStoreAdapter('some-name'));

const indexedDb$ = new PersistentBehaviorSubject('', indexedDbAdapter('MyDB'));

const ionic$ = new PersistentBehaviorSubject('ionic', ionicStorageAdapter('some-key'));

const preferences$ = new PersistentBehaviorSubject('preferences', capacitorPreferencesAdapter('some-key'));

const memory$ = new PersistentBehaviorSubject('memory', memoryAdapter());

localStorage$.next('value');
