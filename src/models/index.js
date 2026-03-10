const { Sequelize } = require('sequelize');
const OrderModel = require('./Order');
const ItemModel = require('./Item');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'jitterbit_orders',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const Order = OrderModel(sequelize);
const Item = ItemModel(sequelize);

Order.hasMany(Item, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'Items' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { sequelize, Order, Item };
