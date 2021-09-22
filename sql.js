module.exports = {
  // couple 인증 관련
  updateDateRecordCoupleIdSql: `
    UPDATE DATERECORD
       SET COUPLE_ID = ?
     WHERE 1=1
       AND USER_ID = ?
        OR USER_ID = ?
  `,
  getUsersByCoupleIdSql: `
    SELECT couple1_id, couple2_id
      FROM COUPLE
     WHERE couple_id = ?
  `,
  updateCoupleStatusSql: `
    UPDATE COUPLE
       SET status = ?
     WHERE couple_id = ?
  `,
  updateRequestCoupleUserSql: `
    UPDATE USERS
       SET couple_id = ?
     WHERE user_id = ?
  `,
  requestCoupleSql: `
    INSERT INTO COUPLE(couple1_id, couple2_id, status) VALUES(?, ?, 0)
  `,
  getUserByEmailSql: (email) =>
    `SELECT user_id,
            email,
            couple_id,
            nickname,
            thumbnailImageUrl
      FROM USERS
     WHERE email LIKE '%${email}%@%'
  `,
  getUserByTokenSql: `
  SELECT A.user_id,
         A.token,
         A.email,
         A.couple_id,
         A.nickname,
         A.birthday,
         A.gender,
         A.profileImageUrl,
         A.thumbnailImageUrl
    FROM users A
   WHERE 1=1
     AND A.token = ?
  `,

  // redux > auth > user객체1
  getUserCoupleByTokenSql: `
  SELECT A.user_id,
         A.token,
         A.email,
         A.couple_id,
         B.status as couple_status,
         B.couple1_id,
         B.couple2_id,
         IF (A.user_id = B.couple1_id, B.couple2_id, B.couple1_id) as partner,
         A.nickname,
         A.birthday,
         A.gender,
         A.profileImageUrl,
         A.thumbnailImageUrl
    FROM users A, couple B
   WHERE 1=1
     AND A.token = ?
     AND A.user_id = B.couple1_id
      OR A.token = ?
     AND A.user_id = B.couple2_id
  `,
  // redux > auth > user객체2
  getPartnerCoupleByUserIdSql: `
  SELECT A.user_id,
         A.token,
         A.email,
         A.couple_id,
         B.status as couple_status,
         B.couple1_id,
         B.couple2_id,
         A.nickname,
         A.birthday,
         A.gender,
         A.profileImageUrl,
         A.thumbnailImageUrl
    FROM users A, couple B
   WHERE 1=1
     AND B.couple2_id = ?
     AND A.user_id = B.couple2_id
      OR B.couple1_id = ?
     AND A.user_id = B.couple1_id
  `,

  findUserSql: `
     SELECT user_id,
            token,
            email
       FROM USERS
      WHERE email = ?
  `,
  loginSql: `
    INSERT INTO
    USERS (token, email, nickname, birthday, gender, profileImageUrl, thumbnailImageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `,
  updateUserProfileImgUrlSql: `
    UPDATE USERS
       SET token = ?,
           email = ?,
           nickname = ?,
           birthday = ?,
           gender = ?,
           profileImageUrl = ?,
           thumbnailImageUrl = ?
     WHERE email = ?;
  `,

  // main select
  getCoupleStatus: `
  SELECT status
    FROM COUPLE
   WHERE couple1_id = (select user_id from users where token = ?)
      OR couple2_id = (select user_id from users where token = ?)
  `,
  // 커플 인증 후 - Pagination
  selectDateRecordListByCoupleIdPaginatedSql: (searchOption) =>
    `
      SELECT @n:=@n+1 dateCnt, t.dateRecord_id
                             , t.dateTime
                             , t.title
                             , t.description
                             , t.image
                             , t.created_at
        FROM (SELECT @n:=( SELECT count(*)
                            FROM dateRecord
                            WHERE 1=1
                            AND ISDELETED = 0
                            AND couple_id = (
                                              SELECT couple_id
                                                FROM couple
                                               WHERE 1=1
                                                 AND couple1_id = (SELECT user_id FROM users WHERE token = ?)
                                                  OR couple2_id = (SELECT user_id FROM users WHERE token = ?)
                                            )
                            AND dateTime < ?)) initvars, (SELECT *
                                                            FROM dateRecord
                                                            WHERE 1=1
                                                              AND ISDELETED = 0
                                                              AND couple_id = (
                                                                                SELECT couple_id
                                                                                  FROM couple
                                                                                 WHERE 1=1
                                                                                   AND couple1_id = (SELECT user_id FROM users WHERE token = ?)
                                                                                    OR couple2_id = (SELECT user_id FROM users WHERE token = ?)
                                                                               )
                                                              AND dateTime BETWEEN ? AND ?
                                                            ORDER BY dateTime ASC
                                                         ) t
       WHERE 1=1
       ORDER BY DATECNT ${searchOption.sort == "desc" ? "desc" : "asc"}
       LIMIT ? OFFSET ?;

      SELECT place_id,
             dateRecord_id,
             place_name,
             latLong
        FROM PLACE
       WHERE ISDELETED = 0;

      SELECT dateImage_id,
              dateRecord_id,
              dateImage_name
        FROM DATEIMAGE
       WHERE ISDELETED = 0;

       SELECT count(*) as countRow
        FROM dateRecord
        WHERE 1=1
         AND ISDELETED = 0
         AND couple_id = (
                            SELECT couple_id
                              FROM couple
                             WHERE 1=1
                               AND couple1_id = (SELECT user_id FROM users WHERE token = ?)
                                OR couple2_id = (SELECT user_id FROM users WHERE token = ?)
                          )
         AND dateTime BETWEEN ? AND ?;
    `,
  // 커플 인증 전 - Pagination
  selectDateRecordListByUserIdPaginatedSql: (searchOption) =>
    `
    SELECT @n:=@n+1 dateCnt, t.dateRecord_id
                            , t.dateTime
                            , t.title
                            , t.description
                            , t.image
                            , t.created_at
      FROM (SELECT @n:=( SELECT count(*)
                          FROM dateRecord
                          WHERE 1=1
                          AND ISDELETED = 0
                          AND user_id = (SELECT user_id FROM users WHERE token = ?)
                          AND dateTime < ?)) initvars, (SELECT *
                                                          FROM dateRecord
                                                         WHERE 1=1
                                                           AND ISDELETED = 0
                                                           AND user_id = (SELECT user_id FROM users WHERE token = ?)
                                                           AND dateTime BETWEEN ? AND ?
                                                         ORDER BY dateTime ASC) t
     WHERE 1=1
     ORDER BY DATECNT ${searchOption.sort == "desc" ? "desc" : "asc"}
     LIMIT ? OFFSET ?;

    SELECT place_id,
            dateRecord_id,
            place_name,
            latLong
      FROM PLACE
     WHERE ISDELETED = 0;

    SELECT dateImage_id,
            dateRecord_id,
            dateImage_name
      FROM DATEIMAGE
     WHERE ISDELETED = 0;

    SELECT count(*) as countRow
      FROM dateRecord
     WHERE 1=1
       AND ISDELETED = 0
       AND user_id = (SELECT user_id FROM users WHERE token = ?)
       AND dateTime BETWEEN ? AND ?;
    `,
  // 커플 인증 전
  selectDateRecordListByUserIdSql: (searchOption) =>
    `
    SELECT @n:=@n+1 dateCnt, t.dateRecord_id
                           , t.dateTime
                           , t.title
                           , t.description
                           , t.image
                           , t.created_at
      FROM (SELECT @n:=( SELECT count(*)
                           FROM dateRecord
                          WHERE 1=1
                            AND ISDELETED = 0
                            AND dateTime < ?)) initvars, (SELECT *
                                                            FROM dateRecord
                                                           WHERE 1=1
                                                             AND ISDELETED = 0
                                                             AND user_id = (select user_id from users where token = ?)
                                                             AND dateTime BETWEEN ? AND ?
                                                           ORDER BY dateTime ASC) t
     WHERE 1=1
     ORDER BY DATECNT ${searchOption.sort == "desc" ? "desc" : "asc"};

    SELECT place_id,
           dateRecord_id,
           place_name,
           latLong
      FROM PLACE
     WHERE ISDELETED = 0;

    SELECT dateImage_id,
           dateRecord_id,
           dateImage_name
      FROM DATEIMAGE
     WHERE ISDELETED = 0
    `,
  // 커플 인증 후
  selectDateRecordListByCoupleIdSql: (searchOption) =>
    `
      SELECT @n:=@n+1 dateCnt, t.dateRecord_id
                             , t.dateTime
                             , t.title
                             , t.description
                             , t.image
                             , t.created_at
        FROM (SELECT @n:=( SELECT count(*)
                             FROM dateRecord
                            WHERE 1=1
                              AND ISDELETED = 0
                              AND dateTime < ?)) initvars, (SELECT *
                                                              FROM dateRecord
                                                             WHERE 1=1
                                                               AND ISDELETED = 0
                                                               AND couple_id = (
                                                                                SELECT couple_id
                                                                                  FROM couple
                                                                                 WHERE 1=1
                                                                                   AND couple1_id = (SELECT user_id from users WHERE token = ?)
                                                                                    OR couple2_id = (SELECT user_id FROM users WHERE token = ?)
                                                                                )
                                                               AND dateTime BETWEEN ? AND ?
                                                             ORDER BY dateTime ASC) t
       WHERE 1=1
       ORDER BY DATECNT ${searchOption.sort == "desc" ? "desc" : "asc"};

      SELECT place_id,
             dateRecord_id,
             place_name,
             latLong
        FROM PLACE
       WHERE ISDELETED = 0;

      SELECT dateImage_id,
             dateRecord_id,
             dateImage_name
        FROM DATEIMAGE
       WHERE ISDELETED = 0;
    `,

  selectDateRecordByDateRecordIdQuery: `
    SELECT dateRecord_id,
           dateTime,
           title,
           description,
           image,
           created_at
      FROM dateRecord
     WHERE 1=1
       AND dateRecord_id = ?
       AND ISDELETED = 0;

    SELECT place_id,
           dateRecord_id,
           place_name,
           latLong
      FROM place
     WHERE 1=1
       AND dateRecord_id = ?
       AND ISDELETED = 0;

    SELECT dateImage_id,
           dateRecord_id,
           dateImage_name
      FROM dateImage
     WHERE 1=1
      AND dateRecord_id = ?
      AND ISDELETED = 0;
  `,
};
