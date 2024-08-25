import { pool } from './database.js'

export const buildNestedCategories = (categories, parentId = 0) => {
    return categories
      .filter(category => category.parent_id === parentId)
      .map(category => ({
        id: category.category_id,
        category: category.name,
        subcategories: buildNestedCategories(categories, category.category_id),
      }));
  };
  
export const fetchCategories = async () => {
    const [rows] = await pool.execute(`
      WITH RECURSIVE category_hierarchy AS (
        SELECT
          category_id,
          name,
          parent_id
        FROM
          category
        WHERE
          parent_id = 0
        UNION ALL
        SELECT
          c.category_id,
          c.name,
          c.parent_id
        FROM
          category c
        INNER JOIN category_hierarchy ch ON ch.category_id = c.parent_id
      )
      SELECT * FROM category_hierarchy;
    `);
  
    return rows;
  };