import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "globalea",
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(pool);
