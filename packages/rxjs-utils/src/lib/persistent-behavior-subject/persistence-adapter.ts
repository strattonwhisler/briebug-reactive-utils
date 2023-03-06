export interface PersistenceAdapter<T> {
  /**
   * Reads the value from the persistent layer
   */
  read(): Promise<T | undefined>;

  /**
   * Writes the value to the persistent layer
   */
  write(value: T): Promise<void>;

  /**
   * Clears the value from the persistent layer
   */
  clear(): Promise<void>;
}
