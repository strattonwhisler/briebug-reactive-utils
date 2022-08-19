// persistent-behavior-subject

import { BehaviorSubject } from 'rxjs';

export type AcceptedStorage = { type: AcceptedStorageType, options: AcceptedStorageOption; };

export type AcceptedStorageType = Storage | 'custom';
export type AcceptedStorageOption = {
  name?: string,
  write?: (val: any) => void,
  delete?: () => void;
};

/**
 * A variant of BehaviorSubject that automatically stores the most recent value to storage.
 * The default location is localStorage but can be specified to use anything.
 *
 * @class PersistentBehaviorSubject<T>
 */
export class PersistentBehaviorSubject<T> extends BehaviorSubject<T> {
  public storage: AcceptedStorage;

  constructor(value: T, storage?: AcceptedStorage | string) {
    super(value);
    if (typeof storage === 'string') {
      this.storage = { type: localStorage, options: { name: storage } };
    } else {
      this.storage = storage ?? { type: localStorage, options: { name: 'PBS-' + Date.now() } };
    }
    this.write(value);
  }

  /**
   * Save the data to the specified storage location.
   */
  private write(newValue: T): void {
    switch (this.storage.type) {
      case localStorage:
      case sessionStorage:
        if (this.storage.options.name) {
          this.storage.type.setItem(this.storage.options.name, JSON.stringify(newValue));
        } else if (this.storage.options.write) {
          this.storage.options.write(newValue);
        }
        break;
      // case 'indexDB':
      // case 'ionicStorage':
      // case 'memoryBase':
      // case 'cookie':
      case 'custom':
        if (this.storage.options.write) {
          this.storage.options.write(newValue);
        }
        break;
    }
  }

  /**
   * Delete the stored value from the specified storage location.
   */
  public delete(): void {
    switch (this.storage.type) {
      case localStorage:
      case sessionStorage:
        if (this.storage.options.name) {
          this.storage.type.removeItem(this.storage.options.name);
        } else if (this.storage.options.delete) {
          this.storage.options.delete();
        }
        break;
      case 'indexDB':
      case 'ionicStorage':
      case 'memoryBase':
      case 'cookie':
      case 'custom':
        if (this.storage.options.delete) {
          this.storage.options.delete();
        }
        break;
    }
  }

  public override next(value: T): void {
    this.write(value);
    super.next(value);
  }
}