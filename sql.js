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
    REPLACE INTO
    USERS (token, email, nickname, birthday, gender, profileImageUrl, thumbnailImageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  // main select
  getCoupleStatus: `
  SELECT status
    FROM COUPLE
   WHERE couple1_id = (select user_id from users where token = ?)
      OR couple2_id = (select user_id from users where token = ?)
  `,
  // 커플 인증 전
  selectQueryByUserId: (searchOption) =>
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
                                                            AND user_id = (
                                                              select user_id from users where token = ?
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
      WHERE ISDELETED = 0
    `,
  // 커플 인증 후
  selectQueryByCoupleId: (searchOption) =>
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
                                                                select couple_id
                                                                from couple
                                                                where 1=1
                                                                and couple1_id = (
                                                                  select user_id from users where token = ?
                                                                )
                                                                or couple2_id = (
                                                                  select user_id from users where token = ?
                                                                )
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
};
