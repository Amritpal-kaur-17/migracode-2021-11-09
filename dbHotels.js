const { Pool } = require("pg");
const pool = new Pool({
  user: "ebargues",
  host: "localhost",
  database: "hotels",
  password: "1469fjsd",
});

const db = () => {
  const get = async () => {
    const result = await pool.query("select * from hotels");
    return result.rows;
  };

  return { get };
};

module.exports = db;
