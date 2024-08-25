import { pool } from "./database.js";
import { isUserInMainCity } from "./users.js";

export async function setCartAndCartItems(customer_id, cart_items) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [cartResult] = await connection.execute(
      "INSERT INTO cart (customer_id) VALUES (?)",
      [customer_id]
    );
    const cartId = cartResult.insertId;

    const insertCartItemQuery =
      "INSERT INTO cart_items (cart_id, product_id, variant_id) VALUES ?";
    const cartItemsData = cart_items.map((item) => [
      cartId,
      item.product_id,
      item.variant_id,
    ]);

    await connection.query(insertCartItemQuery, [cartItemsData]);

    await connection.commit();

    return {
      cartId: cartId,
      cartItemsCount: cart_items.length,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getCartItems(cartId) {
  const connection = await pool.getConnection();
  try {
    const cartQuery = `
      SELECT ci.cart_id, ci.product_id, ci.variant_id, p.title, v.price, 
             pr.detailed_description, v.image, i.stock, c.customer_id
      FROM cart_items AS ci
      JOIN product p ON ci.product_id = p.product_id
      JOIN variant v ON ci.variant_id = v.variant_id
      JOIN property pr ON ci.variant_id = pr.variant_id
      JOIN inventory i ON ci.variant_id = i.variant_id
      JOIN cart c ON ci.cart_id = c.cart_id
      WHERE ci.cart_id = ?;
    `;

    const [cartRows] = await connection.execute(cartQuery, [cartId]);
    if (cartRows.length === 0) {
      throw new Error('Cart not found.');
    }

    const customerId = cartRows[0].customer_id;
    const isMainCity = await isUserInMainCity(customerId);

    let maxDeliveryTime = 0;
    const cartItems = cartRows.map(row => {
      let itemDeliveryTime = isMainCity ? 5 : 7;
      if (row.stock === 0) {
        itemDeliveryTime += 3;
      }
      maxDeliveryTime = Math.max(maxDeliveryTime, itemDeliveryTime);

      return {
        cartId: row.cart_id,
        productId: row.product_id,
        variantId: row.variant_id,
        title: row.title,
        price: row.price,
        detailedDescription: row.detailed_description,
        image: row.image,
        stock: row.stock,
      };
    });
    cartItems.forEach(item => item.deliveryEstimate = maxDeliveryTime);
    return cartItems;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

