/**
 * Port interface for configuration management.
 * Defines the contract for accessing application configuration.
 */
export interface ConfigurationPort {
  /**
   * Gets a configuration value by key.
   * @param key - Configuration key
   * @param defaultValue - Optional default value if key not found
   * @returns Configuration value or default
   */
  get<T>(key: string, defaultValue?: T): T;

  /**
   * Gets a nested configuration object.
   * @param key - Configuration key path (dot-separated)
   * @param defaultValue - Optional default value if key not found
   * @returns Configuration object or default
   */
  getObject<T>(key: string, defaultValue?: T): T;

  /**
   * Checks if a configuration key exists.
   * @param key - Configuration key
   * @returns True if key exists
   */
  has(key: string): boolean;
}