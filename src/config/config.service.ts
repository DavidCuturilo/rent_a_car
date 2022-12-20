import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';

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
   * Goes through the environment variables defined by the passed keys, and throws an error if any of them are missing.
   */
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  /**
   * @returns the port number the server should listen on, defined in the environment variable PORT
   */
  public getPort() {
    return this.getValue('PORT', true);
  }

  /**
   * Returns the TypeORM configuration formed from the ormconfig.ts file.
   */
  public getTypeOrmConfig() {
    const config = ormconfig;
    // this fixes an issue with an error on startup not allowing imports outside a module
    config.migrations = ['src/migration/*.js'];
    return config as TypeOrmModuleOptions;
  }

  /**
   * Extracts the JWT secret and JWT expiration time from the environment variables.
   * @deprecated not used anywhere
   */
  public getJwtConfig() {
    return {
      secret: this.getValue('JWT_SECRET'),
      signOptions: {
        expiresIn: this.getValue('JWT_EXPIRES_IN'),
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'PG_HOST',
  'PG_PORT',
  'PG_USERNAME',
  'PG_PASSWORD',
  'PG_DB_NAME',
]);
export { configService };
