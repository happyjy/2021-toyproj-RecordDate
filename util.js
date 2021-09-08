module.exports = {
  getAuthorization: function (req) {
    // console.log("### req.header(authorization)", req.header("authorization"));
    return req.header("authorization").split(" ")[1];
  },
  printQuery: function (sql, param) {
    var sqlQuery = sql;
    param.forEach((v) => {
      sqlQuery = sqlQuery.replace("?", `"${v}"`);
    });
    console.log(sqlQuery);
  },
};
