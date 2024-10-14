import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class QueryBuilderService {
  private conn: Pool;
  constructor() {
    this.conn = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
    });
  }

  public async runQuery(query: string, params: any[] = []): Promise<any[]> {
    let client: PoolClient;

    try {
      client = await this.conn.connect();
      const res = await client.query(query, params);
      return res.command === 'SELECT' ? res.rows : [res.rowCount];
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    } finally {
      if (client) client.release();
    }
  }

  public async runTransaction(
    queries: { query: string; params: any[] }[],
  ): Promise<void> {
    let client: PoolClient;

    try {
      client = await this.conn.connect();

      await client.query('BEGIN');

      for (const { query, params } of queries) {
        await client.query(query, params);
      }

      await client.query('COMMIT');
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }
      throw new InternalServerErrorException({ message: error.message });
    } finally {
      if (client) client.release();
    }
  }
}
