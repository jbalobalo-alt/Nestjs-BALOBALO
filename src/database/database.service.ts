import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  pool!: mysql.Pool;
  
  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 25137),
      user: process.env.DB_USERS ,
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_NAME ,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,  
    });
    // optional:
    const conn = await this.pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('MySQL pool created');
  }

  async onModuleDestroy() {
    await this.pool.end();  
  }

  getpool() {
    return this.pool;
  }
}