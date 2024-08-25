import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

const createProcedure = async () => {
    const createProcedureScript = `
    CREATE PROCEDURE get_child_categories(IN p_parent_id INT, OUT result TEXT)
    BEGIN
        DECLARE done INT DEFAULT FALSE;
        DECLARE child_category_id INT;
        DECLARE cur1 CURSOR FOR SELECT category_id FROM category WHERE parent_id = p_parent_id;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

        SET result = '';

        OPEN cur1;

        FETCH cur1 INTO child_category_id;
        IF done THEN
            SET result = CAST(p_parent_id AS CHAR);
        ELSE
            read_loop: LOOP
                SET result = CONCAT(result, child_category_id, ',');

                CALL get_child_categories(child_category_id, @sub_result);

                IF LENGTH(@sub_result) > 0 THEN
                    SET result = CONCAT(result, @sub_result, ',');
                END IF;

                FETCH cur1 INTO child_category_id;
                IF done THEN
                    LEAVE read_loop;
                END IF;
            END LOOP;
        END IF;

        CLOSE cur1;

        IF RIGHT(result, 1) = ',' THEN
            SET result = LEFT(result, LENGTH(result) - 1);
        END IF;
    END;
`;
  try {
    const connection = await pool.getConnection();
    await connection.query('DROP PROCEDURE IF EXISTS get_child_categories');
    await connection.query(createProcedureScript);
    await connection.release();
    console.log('Stored procedure created successfully!');
  } catch (error) {
    console.error('Error creating stored procedure:', error);
  }
};

// Initialize the stored procedure on startup
await createProcedure();
