const { Order, Item } = require('../models');
const { mapOrderToResponse } = require('../utils/orderMapper');

async function create(order) {
  const t = await require('../models').sequelize.transaction();
  try {
    await Order.create(
      {
        orderId: order.orderId,
        value: order.value,
        creationDate: order.creationDate,
      },
      { transaction: t }
    );
    if (order.items && order.items.length > 0) {
      await Item.bulkCreate(
        order.items.map((it) => ({
          orderId: order.orderId,
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
        })),
        { transaction: t }
      );
    }
    await t.commit();
    return getById(order.orderId);
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function getById(orderId) {
  const orderRow = await Order.findByPk(orderId, {
    include: [{ model: Item, as: 'Items', attributes: ['productId', 'quantity', 'price'] }],
  });
  if (!orderRow) return null;
  const plain = orderRow.get({ plain: true });
  return mapOrderToResponse(plain, plain.Items || []);
}

async function listAll() {
  const rows = await Order.findAll({
    order: [['creationDate', 'DESC']],
    include: [{ model: Item, as: 'Items', attributes: ['productId', 'quantity', 'price'] }],
  });
  return rows.map((row) => {
    const plain = row.get({ plain: true });
    return mapOrderToResponse(plain, plain.Items || []);
  });
}

async function update(orderId, order) {
  const t = await require('../models').sequelize.transaction();
  try {
    const existing = await Order.findByPk(orderId, { transaction: t });
    if (!existing) {
      await t.rollback();
      return null;
    }
    await existing.update(
      { value: order.value, creationDate: order.creationDate },
      { transaction: t }
    );
    await Item.destroy({ where: { orderId }, transaction: t });
    if (order.items && order.items.length > 0) {
      await Item.bulkCreate(
        order.items.map((it) => ({
          orderId,
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
        })),
        { transaction: t }
      );
    }
    await t.commit();
    return getById(orderId);
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function remove(orderId) {
  const deleted = await Order.destroy({ where: { orderId } });
  return deleted > 0;
}

module.exports = {
  create,
  getById,
  listAll,
  update,
  remove,
};
