import { pool } from "./database.js";

export const getVariants = async () => {
  let results = [];
  try {
    const [rows] = await pool.query(
      `select 
                p.product_id, 
                p.title, 
                v.variant_id, 
                v.price, 
                p.weight,  
                p.category_id, 
                p.default_price,
                v.image, 
                v.details, 
                pr.detailed_description 
                from product as p 
                join variant as v 
                on p.product_id = v.product_id 
                join property as pr 
                on v.variant_id = pr.variant_id`
    );
    results = rows;
  } catch (err) {
    console.error("Error querying the database:", err);
  } finally {
    return results;
  }
};

export async function getProductsByCategory(categoryId) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.query("CALL get_child_categories(?, @category_list)", [
      categoryId,
    ]);
    const [categoryListResult] = await connection.query(
      "SELECT @category_list"
    );
    const categoryList = categoryListResult[0]["@category_list"];
    if (!categoryList) {
      throw new Error("No categories found");
    }
    const selectQuery = `SELECT 
      p.product_id, 
      p.title, 
      v.variant_id, 
      v.price, 
      p.weight,  
      p.category_id, 
      p.default_price,
      v.image, 
      v.details, 
      pr.detailed_description 
    FROM product AS p 
    JOIN variant AS v ON p.product_id = v.product_id 
    JOIN property AS pr ON v.variant_id = pr.variant_id 
    WHERE p.category_id IN (${categoryList})`;

    const [products] = await connection.query(selectQuery);
    await connection.commit();
    return products;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      await connection.release();
    }
  }
}
