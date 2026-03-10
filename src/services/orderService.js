const pool = require('../config/database');
const { mapOrderToResponse } = require('../utils/orderMapper');

async function create(order) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO "Order" ("orderId", "value", "creationDate") VALUES ($1, $2, $3)`,
      [order.orderId, order.value, order.creationDate]
    );

    for (const item of order.items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
        [order.orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return getById(order.orderId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getById(orderId) {
  const orderResult = await pool.query(
    `SELECT "orderId", "value", "creationDate" FROM "Order" WHERE "orderId" = $1`,
    [orderId]
  );

  const orderRow = orderResult.rows[0];
  if (!orderRow) return null;

  const itemsResult = await pool.query(
    `SELECT "productId", "quantity", "price" FROM "Items" WHERE "orderId" = $1`,
    [orderId]
  );

  return mapOrderToResponse(orderRow, itemsResult.rows);
}

async function listAll() {
  const orderResult = await pool.query(
    `SELECT "orderId", "value", "creationDate" FROM "Order" ORDER BY "creationDate" DESC`
  );

  const orders = [];
  for (const row of orderResult.rows) {
    const full = await getById(row.orderId);
    if (full) orders.push(full);
  }
  return orders;
}

async function update(orderId, order) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existResult = await client.query(
      `SELECT 1 FROM "Order" WHERE "orderId" = $1`,
      [orderId]
    );
    if (existResult.rows.length === 0) {
      return null;
    }

    await client.query(
      `UPDATE "Order" SET "value" = $1, "creationDate" = $2 WHERE "orderId" = $3`,
      [order.value, order.creationDate, orderId]
    );

    await client.query(`DELETE FROM "Items" WHERE "orderId" = $1`, [orderId]);

    for (const item of order.items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return getById(orderId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function remove(orderId) {
  const result = await pool.query(
    `DELETE FROM "Order" WHERE "orderId" = $1 RETURNING "orderId"`,
    [orderId]
  );
  return result.rowCount > 0;
}

module.exports = {
  create,
  getById,
  listAll,
  update,
  remove,
};
