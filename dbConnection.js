const mysql = require("mysql");
const env = process.argv[2] || "prod";

let connection = "";
let dbConfigObj;

if (env !== "dev") {
  console.log("### dbConnection.js > mysql connection 설정 - prod");
  dbConfigObj = {
    host: process.env.DB_PROD_USER,
    user: process.env.DB_PROD_PASSWORD,
    password: process.env.DB_PROD_HOST,
    database: process.env.DB_PROD_DATABASE,
    multipleStatements: true,
  };
} else {
  console.log("### dbConnection.js > mysql connection 설정 - dev");
  dbConfigObj = {
    connectionLimit: 20,
    host: "127.0.0.1",
    user: "jyoon",
    password: "1004",
    port: "3306",
    database: "record_date",
    multipleStatements: true,
  };
}

module.exports = {
  poolType: mysql.createPool(dbConfigObj), // createPool 사용
  dbConfig: connection, // createConnection  사용
};
