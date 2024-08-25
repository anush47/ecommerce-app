import { pool } from "./database.js";

export async function getQuarterlySales(selectedYear) {
  const sql = `
      SELECT
        YEAR(order_date) AS sales_year,
        QUARTER(order_date) AS quarter,
        SUM(total_amount) AS total_sales
      FROM orders
      WHERE YEAR(order_date) = ?
      GROUP BY sales_year, quarter
    `;

  const [rows] = await pool.execute(sql, [selectedYear]);
  return rows;
}

export async function getTopSellingProduct(startDate, endDate) {
  const sql = `
      SELECT
        ci.product_id,
        p.title,
        COUNT(ci.product_id) AS total_sales
      FROM
        cart_items AS ci
      JOIN
        orders AS o ON ci.cart_id = o.cart_id
      JOIN
        product AS p ON ci.product_id = p.product_id
      WHERE
        o.order_date >= ? AND o.order_date <= ?
      GROUP BY
        ci.product_id, p.title
      ORDER BY
        total_sales DESC
      LIMIT 1;
    `;``
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, [startDate, endDate]);
    return rows;
  } finally {
    connection.release();
  }
}

export async function getMostSellingCategoryId() {
  const sql = `
      SELECT
          c.category_id,
          c.name,
          COUNT(DISTINCT o.order_id) AS total_orders
      FROM
          category AS c
      JOIN
          product AS p ON c.category_id = p.category_id
      JOIN
          variant AS v ON p.product_id = v.product_id
      JOIN
          cart_items AS ci ON v.variant_id = ci.variant_id
      JOIN
          orders AS o ON ci.cart_id = o.cart_id
      GROUP BY
          c.category_id, c.name
      ORDER BY
          total_orders DESC
      LIMIT 1;
    `;
  const [rows] = await pool.query(sql);
  return rows[0] ? rows[0].category_id : null;
}

export async function getCategoryHierarchy(categoryId) {
  const sql = `
      WITH RECURSIVE CategoryPath AS (
          SELECT
              category_id,
              parent_id,
              name
          FROM
              category
          WHERE
              category_id = ?
          UNION ALL
          SELECT
              c.category_id,
              c.parent_id,
              c.name
          FROM
              category c
          INNER JOIN CategoryPath cp ON cp.parent_id = c.category_id
      )
      SELECT * FROM CategoryPath;
    `;
  const [rows] = await pool.query(sql, [categoryId]);
  return rows.reverse();
}

export const getPeakInterestPeriod = async (productId) => {
    const query = `
      SELECT DATE(orders.order_date) AS time_period, COUNT(*) AS cart_appearances
      FROM cart
      JOIN cart_items ON cart.cart_id = cart_items.cart_id
      JOIN orders ON cart.cart_id = orders.cart_id
      WHERE cart_items.product_id = ?
      GROUP BY time_period
      ORDER BY cart_appearances DESC
      LIMIT 1;
    `;
  
    try {
      const [rows] = await pool.query(query, [productId]);
      return rows;
    } catch (error) {
      throw error;
    }
  };
  
