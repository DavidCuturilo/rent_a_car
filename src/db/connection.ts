import { Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { configService } from 'src/config/config.service';

const logger = new Logger('Connection');

const pool = new Pool({
  host: configService.getValue('PG_HOST'),
  database: configService.getValue('PG_DB_NAME'),
  user: configService.getValue('PG_USERNAME'),
  password: configService.getValue('PG_PASSWORD'),
  port: +(configService.getValue('PG_PORT') ?? 5432),
});

logger.debug('Successfully connected to database ✅');

export const db = pool;
