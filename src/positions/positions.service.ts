import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getpool();

  async createPosition(positions_code: string, positions_name: string, userId: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO positions (positions_code, positions_name, id) VALUES (?, ?, ?)',
      [positions_code, positions_name, userId],
    );
    return { positions_id: result.insertId, positions_code, positions_name, id: userId };
  }

  async getAllPositions() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM positions'
    );
    return rows;
  }

  async getPositionById(positions_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM positions WHERE positions_id = ?',
      [positions_id]
    );
    return rows[0];
  }

  async updatePosition(positions_id: number, partial: { positions_code?: string; positions_name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.positions_code) {
      fields.push('positions_code = ?');
      values.push(partial.positions_code);
    }
    if (partial.positions_name) {
      fields.push('positions_name = ?');
      values.push(partial.positions_name);
    }
    if (fields.length === 0) {
        return this.getPositionById(positions_id);
    }
    values.push(positions_id);
    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE positions_id = ?`;
    await this.pool().execute(sql, values);
    return this.getPositionById(positions_id);
  }

  async deletePosition(positions_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM positions WHERE positions_id = ?',
      [positions_id]
    );
    return res.affectedRows > 0;
  }
}

