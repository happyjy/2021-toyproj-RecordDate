module.exports = {
  getAuthorization: function (req) {
    console.log("### req.header(authorization)", req.header("authorization"));
    return req.header("authorization").split(" ")[1];
  },
};
