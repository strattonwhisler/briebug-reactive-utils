import { PersistenceAdapter } from "./persistence-adapter";

export const memoryAdapter = <T>(): PersistenceAdapter<T> => {
    let value = undefined;

    return {
        async read(): Promise<T> {
            return value;
        },

        async write(_value: T): Promise<T> {
            value = _value;
            return value;
        },

        async clear(): Promise<void> {
            value = undefined;
        }
    };
}
