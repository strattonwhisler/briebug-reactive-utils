import { PersistenceAdapter } from "./persistence-adapter";

export const ionicStorageAdapter = <T>(
    storage: Storage,
    key: string
): PersistenceAdapter<T> => ({
    async read(): Promise<T> {
        return storage.get(key);
    },

    async write(value: T): Promise<T> {
        await storage.set(key, value);
        return value;
    },

    async clear(): Promise<void> {
        await storage.remove(key);
    }
});
