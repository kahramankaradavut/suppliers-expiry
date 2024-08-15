const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'suppliers-expiry',
  password: '1234',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Veritabanı bağlantı hatası:', err.stack);
  }
  console.log('Veritabanı bağlantısı başarılı');
});

module.exports = pool;