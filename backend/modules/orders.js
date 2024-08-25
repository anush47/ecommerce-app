import { pool } from './database.js'

export async function insertOrder(orderData) {
    const { customer_id, total_amount, delivery_method, payment_method, order_date, delivery_estimate, cart_id } = orderData;
    const sql = `
      INSERT INTO orders (customer_id, total_amount, delivery_method, payment_method, order_date, delivery_estimate, cart_id)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    
    const values = [customer_id, total_amount, delivery_method, payment_method, order_date, delivery_estimate, cart_id];
  
    try {
      const [result] = await pool.execute(sql, values);
      console.log('Insertion result:', result);
      return result;
    } catch (error) {
      console.error('Error during order insertion:', error);
      throw error;
    }
  }

  export const getDistinctOrderYears = async () => {
    const [results] = await pool.query('SELECT DISTINCT YEAR(order_date) AS year FROM orders');
    return results.map(row => row.year);
  };

  export const getOrderDetails = async () => {
    const query = `
      SELECT 
        o.order_id, 
        CONCAT(u.first_name, ' ', u.last_name) AS name, 
        u.phone_no, 
        o.total_amount, 
        o.delivery_estimate 
      FROM 
        orders AS o
      JOIN 
        user AS u ON o.customer_id = u.user_id
      ORDER BY o.order_id;
    `;
  
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
    }
  };

  // Assuming 'pool' is your database connection pool
export const getOrderItems = async (orderId) => {
  const query = `
    SELECT ci.product_id, ci.variant_id, p.title, v.details
    FROM orders AS o
    JOIN cart_items AS ci ON o.cart_id = ci.cart_id
    JOIN product AS p ON ci.product_id = p.product_id
    JOIN variant AS v ON ci.variant_id = v.variant_id
    WHERE o.order_id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [orderId]);
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error('Error querying the database');
  }
};
