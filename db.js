// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pool de conexiones para manejar múltiples consultas concurrentes
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "D1nast14Plus+",
  database: process.env.DB_NAME || "webshop",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
