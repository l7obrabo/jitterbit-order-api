const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Item = sequelize.define(
    'Item',
    {
      orderId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        field: 'orderId',
      },
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'productId',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'Items',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Item;
};
