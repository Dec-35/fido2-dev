//mariadb config
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fido',
  connectionLimit: 5,
});

export default pool;
