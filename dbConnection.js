const mysql = require("mysql");

const env = process.argv[2] || "prod";
let connection = "";
console.log({ env });
let dbConfigObj;
if (env !== "dev") {
  console.log("### dbConnection.js > mysql connection 설정 - prod");

  dbConfigObj = {
    host: "us-cdbr-east-04.cleardb.com",
    user: "bb9d93a5abeec8",
    password: "6ffcbecf",
    database: "heroku_02032f06a36b7f9",
    multipleStatements: true,
  };

  // connection = mysql.createConnection({
  //   host: dbConf.herokuHost,
  //   user: dbConf.herokuUser,
  //   password: dbConf.herokuPassword,
  //   database: dbConf.herokuDatabase,
  //   multipleStatements: true,
  // });
  // connection.connect();
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

  // connection = mysql.createConnection({
  //   host: "127.0.0.1",
  //   user: "jyoon",
  //   password: "1004",
  //   port: "3306",
  //   database: "record_date",
  //   multipleStatements: true,
  // });
  // connection.connect();
}

module.exports = {
  poolType: mysql.createPool(dbConfigObj), // createPool 사용
  dbConfig: connection, // createConnection  사용
};
