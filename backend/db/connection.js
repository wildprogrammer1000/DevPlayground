const fs = require("fs");
const path = require("path");
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  database: process.env.MARIADB_DATABASE,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  connectionLimit: 10,
});

const initFilePath = path.join(__dirname, "../init/create_table.sql");
fs.readFile(initFilePath, { encoding: "utf-8" }, async (err, data) => {
  if (err) {
    console.error("Error - DB Init: ", err);
    return;
  }
  let conn;
  const queries = data.split(";").filter((query) => query !== "");
  try {
    conn = await pool.getConnection();
    queries.forEach(async (query) => {
      await conn.query(query);
    });
  } catch (err) {
    console.error("Error - DB Init: ", err);
  } finally {
    if (conn) conn.release();
  }
});
module.exports = {
  pool,
};
