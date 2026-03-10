const orderService = require('../services/orderService');
const { mapRequestBodyToOrder } = require('../utils/orderMapper');

async function createOrder(req, res, next) {
  try {
    const mapped = mapRequestBodyToOrder(req.body);
    const order = await orderService.create(mapped);
    res.status(201).json(order);
  } catch (err) {
    if (err.message && err.message.includes('inválid')) {
      return res.status(400).json({ erro: err.message });
    }
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Já existe um pedido com este número.' });
    }
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getById(orderId);
    if (!order) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function updateOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const mapped = mapRequestBodyToOrder(req.body);
    const order = await orderService.update(orderId, mapped);
    if (!order) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }
    res.json(order);
  } catch (err) {
    if (err.message && err.message.includes('inválid')) {
      return res.status(400).json({ erro: err.message });
    }
    next(err);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const deleted = await orderService.remove(orderId);
    if (!deleted) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
};
