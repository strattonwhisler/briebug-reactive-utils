/**
 * @jest-environment jsdom
 */

import assert = require('assert');
import { AcceptedStorage, PersistentBehaviorSubject } from './persistent-behavior-subject';

describe('A PersistentBehaviorSubject', () => {
  let pbs: PersistentBehaviorSubject<boolean>;
  const storageValue = true;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
  });

  describe('with only a value provided', () => {
    it('should save to localStorage as PBS-{{DTS}}', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue);

      expect(pbs.value).toEqual(storageValue);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      assert(Object.keys(localStorage)[0].startsWith('PBS-'));
      expect(localStorage.getItem(Object.keys(localStorage)[0])).toEqual(storageValue.toString());
    });

    it('should detect updates', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue);

      expect(pbs.value).toEqual(storageValue);
      pbs.next(!storageValue);
      expect(pbs.value).toEqual(!storageValue);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('with a value and name provided', () => {
    const storageName = 'testKey';

    it('should save to localStorage as the name provided', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue, storageName);

      expect(pbs.value).toEqual(storageValue);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem(storageName)).toEqual(storageValue.toString());
    });
  });

  describe('with a value and custom options provided', () => {
    const storageObject: AcceptedStorage = {
      type: 'custom',
      options: {
        write: () => { return; },
        delete: () => { return; }
      }
    };
    jest.spyOn(storageObject.options, 'write');
    jest.spyOn(storageObject.options, 'delete');

    it('should execute the custom write function on call', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue, storageObject);

      expect(pbs.value).toEqual(storageValue);
      expect(storageObject.options.write).toHaveBeenCalledTimes(1);
    });

    it('should execute the custom delete function on call', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue, storageObject);
      pbs.delete();

      expect(pbs.value).toEqual(storageValue);
      expect(storageObject.options.delete).toHaveBeenCalledTimes(1);
    });

    it('should not execute the default localStorage call', () => {
      pbs = new PersistentBehaviorSubject<boolean>(storageValue, storageObject);

      expect(pbs.value).toEqual(storageValue);
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });
});
