const con = () => {
  if (global.con && global.con.state !== "disconnected") return global.con;

  try {
    const mysql = require("mysql2/promise");
    const con = mysql.createPool({
      host: "localhost",
      user: "root",
      database: "academy_desk",
      password: "1013",
      port: "3306",
      waitForConnections: true,
      connectionLimit: 30,
      queueLimit: 0,
    });
    global.con = con;
    return con;
  } catch (error) {
    console.log("algo deu erro na conexão com banco de dados:", error);
  }
};
module.exports = { con };
