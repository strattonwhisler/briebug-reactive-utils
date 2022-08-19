export class StorageSyncService {
  /**
   *  Optional Method to create the storage provider
   */
  async create?(): Promise<any> {
    throw new Error('Not Implemented');
  }

  async set(key: string, value: any): Promise<void> {
    throw new Error('Not Implemented');
  }

  async get(key: string): Promise<any> {
    throw new Error('Not Implemented');
  }
}
