import pkg from "pg";
import dotenv from "dotenv";
 
/* =========================
   ENV CONFIG6
========================= */
dotenv.config();
 
const { Pool } = pkg;

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* =========================
   POSTGRES CONNECTION POOL
========================= */
const pool = new Pool({
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT) || 5432,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   
   max: 10,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 2000,
});

/* =========================
   EXPORT POOL
========================= */

export default pool;