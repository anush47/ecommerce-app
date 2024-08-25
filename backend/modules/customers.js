import { pool } from './database.js'
import bcrypt from 'bcrypt'

export const getCustomers = async () => {
    try {
      const query = 'SELECT * FROM customer_public_info';
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
};

