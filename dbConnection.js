const mysql = require("mysql");

const env = process.argv[2] || "prod";
let connection = "";
console.log({ env });
if (env !== "dev") {
  console.log("### mysql connection 설정 - prod");

  connection = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "bb9d93a5abeec8",
    password: "6ffcbecf",
    database: "heroku_02032f06a36b7f9",
    multipleStatements: true,
  });
  // connection.connect();
} else {
  console.log("### mysql connection 설정 - dev");

  connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "jyoon",
    password: "1004",
    port: "3306",
    database: "record_date",
    multipleStatements: true,
  });
  // connection.connect();
}

module.exports = {
  dbconfig: connection,
  // dbconfig: async function () {
  //   let conn, code;
  //   try {
  //     console.log("Initialized!");
  //     code = 0;
  //   } catch (error) {
  //     code = 1;
  //     throw error;
  //   }
  //   return await new Promise((resolve) => {
  //     console.log({ connection });
  //     resolve(connection);
  //   });
  // },
};
