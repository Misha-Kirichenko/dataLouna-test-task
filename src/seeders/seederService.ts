import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

export class SeederService {
  private conn: Pool;

  constructor() {
    this.conn = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
    });
  }

  private async seedUser() {
    const res = await this.conn.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(res.rows[0].count);
    if (!userCount) {
      const email = 'example@mail.com';
      const password = 'Default_123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const balance = 750.85;

      await this.conn.query(
        'INSERT INTO users (email, password, balance) VALUES ($1, $2, $3)',
        [email, hashedPassword, balance],
      );

      console.log('User seeder executed successfully');
    } else {
      console.log('Seeder skipped: Test user already exist in the database.');
    }
  }

  private async seedItems() {
    const res = await this.conn.query('SELECT COUNT(*) FROM items');
    const itemCount = parseInt(res.rows[0].count);

    if (!itemCount) {
      const items = [
        {
          market_hash_name: 'AK-47 | Aquamarine Revenge (Battle-Scarred)',
          currency: 'EUR',
          suggested_price: 13.18,
          item_page:
            'https://skinport.com/item/csgo/ak-47-aquamarine-revenge-battle-scarred',
          market_page:
            'https://skinport.com/market/730?cat=Rifle&item=Aquamarine+Revenge',
          min_price: 11.33,
          max_price: 18.22,
          mean_price: 12.58,
          quantity: 25,
        },
        {
          market_hash_name: '★ M9 Bayonet | Fade (Factory New)',
          currency: 'EUR',
          suggested_price: 319.11,
          item_page:
            'https://skinport.com/item/csgo/m9-bayonet-fade-factory-new',
          market_page: 'https://skinport.com/market/730?cat=Knife&item=Fade',
          min_price: null,
          max_price: null,
          mean_price: null,
          quantity: 0,
        },
      ];

      const query = `
        INSERT INTO items 
        (market_hash_name, currency, suggested_price, item_page, market_page, min_price, max_price, mean_price, quantity) 
        VALUES 
        ${items
          .map(
            (item) => `(
          '${item.market_hash_name}', 
          '${item.currency}', 
          ${item.suggested_price}, 
          '${item.item_page}', 
          '${item.market_page}', 
          ${item.min_price !== null ? item.min_price : 'NULL'}, 
          ${item.max_price !== null ? item.max_price : 'NULL'}, 
          ${item.mean_price !== null ? item.mean_price : 'NULL'}, 
          ${item.quantity}
        )`,
          )
          .join(', ')};
      `;

      await this.conn.query(query);

      console.log('Items seeder executed successfully');
    } else {
      console.log('Seeder skipped: Items already exist in the database.');
    }
  }

  public async runAllSeeders() {
    try {
      await this.seedUser();
      await this.seedItems();
    } catch (error) {
      console.log(error);
    }
  }
}
