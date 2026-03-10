const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'jitterbit_orders',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// verifica conexão ao iniciar
pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool:', err.message);
});

module.exports = pool;
