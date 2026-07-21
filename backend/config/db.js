import pkg from "pg";
import dotenv from "dotenv";

/* =========================
   ENV CONFIG
========================= */
dotenv.config();

const { Pool } = pkg;

/* =========================
   POSTGRES CONNECTION POOL
========================= */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Connection pool settings
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/* =========================
   EXPORT POOL
========================= */
export default pool;