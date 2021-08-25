module.exports = {
  findUser: "SELECT token, email FROM users where 1=1 and email = ?",
  loginSql:
    "INSERT INTO users(token, email, nickname, birthday, gender) VALUES (?, ?, ?, ?, ?);",
};
