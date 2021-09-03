import mysql from "mysql";

// const data = fs.readFileSync("./database.json");
// const conf = JSON.parse(data);
// const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "bb9d93a5abeec8",
  password: "6ffcbecf",
  database: "heroku_02032f06a36b7f9",
  multipleStatements: true,
});
connection.connect();

export default async function DBConfig() {
  let conn, code;
  try {
    connection.query("SELECT * FROM USERS", (err, rows, fields) => {
      if (!err) console.log("### SELECT * FROM USERS: ", rows);
      else console.log("Error while performing Query.", err);
    });

    console.log("Initialized!");
    code = 0;
  } catch (error) {
    code = 1;
    throw error;
  }
}
