module.exports = {
  getUserByEmail: (email) =>
    `SELECT user_id, email, nickname, thumbnailImageUrl FROM USERS WHERE email LIKE '%${email}%@%'`,
  // getUserByEmail: `
  // SELECT email, nickname FROM USERS WHERE email LIKE '%?%';
  // `,
  // SELECT email, nickname FROM USERS WHERE email LIKE '%?%@%';
  getUserByToken: `
  SELECT token, email, nickname, birthday, gender, profileImageUrl, thumbnailImageUrl
        FROM users
       WHERE 1=1
         AND token = ?`,
  findUser: "SELECT user_id, token, email FROM users WHERE 1=1 AND email = ?",
  loginSql:
    "INSERT INTO users(token, email, nickname, birthday, gender, profileImageUrl, thumbnailImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?);",
  updateUserProfileImgUrl:
    "REPLACE into users (user_id, token, email, nickname, birthday, gender, profileImageUrl, thumbnailImageUrl) values(?,?,?,?,?,?,?,?)",
};

// SELECT email, nickname FROM USERS WHERE email LIKE '%asdf%@%';
