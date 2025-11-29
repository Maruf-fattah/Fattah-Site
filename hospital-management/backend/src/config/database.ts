import { Pool } from 'pg';
import config from './config';

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export default pool;
