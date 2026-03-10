const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/order', orderRoutes);

app.use(errorHandler);

module.exports = app;
