const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      orderId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        field: 'orderId',
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'creationDate',
      },
    },
    {
      tableName: 'Order',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Order;
};
