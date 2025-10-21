import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable() 
export class UsersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getpool();

  async createUser(username: string, password: string, fullname: string, email: string, role = 'user') {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO users (username, password, fullname, email, role) VALUES (?, ?, ?,?, ?)',
      [username, hashed, fullname, email, role],
    );
    return { id: result.insertId, username, role, fullname, email};
    
  }

  async findByUsername(username: string) {
    if (typeof username === 'undefined' || username === null) {
        // Return null if username is not provided
        return null;
    }
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, password, role, refresh_token FROM users WHERE username = ?',
      [username],
    );
    return rows[0];
  }

  async findById(id: number) {
    if (typeof id === 'undefined' || id === null) {
      throw new Error('Users id parameter is undefined or null');
    }
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, role, FROM users WHERE refresh_token  = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, role, created_at FROM users',
    );
    return rows;
  }

  async updateUser(id: number, partial: { username?: string; password?: string; role?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.username) {
      fields.push('username = ?');
      values.push(partial.username);
    }

    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    const sql = `UPDATE users SEt ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }
  
  async deleteUser(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM users WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    // Ensure id is defined and not null
    if (id === undefined || id === null) {
      throw new Error('User id must not be undefined or null when setting refresh token.');
    }
    // Convert undefined refreshToken to null for SQL
    const safeRefreshToken = refreshToken === undefined ? null : refreshToken;
    await this.pool().execute('UPDATE users SET refresh_token = ? WHERE id = ?', [safeRefreshToken, id]);
  }

  async findByRefreshToken(refreshToken: string) {
    if (typeof refreshToken === 'undefined' || refreshToken === null) {
      throw new Error('Refresh token parameter is undefined or null');
    }
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, role FROM users WHERE refresh_token = ?',
      [refreshToken],  
    );
    return rows[0]
  }
}

