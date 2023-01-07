// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  /**
   * @returns the value of the environment variable with the given key
   */
  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key.toUpperCase()] || this.env[key.toLowerCase()];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  /**
   * @returns the port number the server should listen on, defined in the environment variable PORT
   */
  public getPort() {
    return this.getValue('PORT', true);
  }
}

const configService = new ConfigService(process.env);

export { configService };
