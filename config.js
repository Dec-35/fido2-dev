//mariadb config
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fidodev',
  connectionLimit: 5,
});

export default pool;
