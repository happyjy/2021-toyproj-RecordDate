require("dotenv").config();
const express = require("express");
// file system
const fs = require("fs");
// client, server port 다름으로 보안상 문제 해결
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
// 파일업로드
const multer = require("multer");
// db connection
const { dbConfig, poolType } = require("./dbConnection");
// getAuthorization
const { getAuthorization, printQuery } = require("./util");
const app = express();
const port = process.env.PORT || 5000;
const env = process.argv[2] || "prod";

let pool = poolType;

app.use(express.static("public"));
app.use("/image", express.static("upload"));
app.use(cors());
app.use(express.json());

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, "/client/build")));
// if (env !== "dev") {
//   console.log("### prod mode ###");
//   app.use(express.static(path.join(__dirname, "/client/build")));
// }

// # test api
app.post("/api/test", (req, res) => {
  console.log(`#########################`);
  console.log(`### app.post("/api/test")`);
  console.log(`### req.params - `, req.params);

  pool.getConnection((err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      connection.query("select * from users", function (err, results) {
        console.log("### /api/test > select * from users", results[1]);
        res.send(results[1]);
        if (err) throw err;
      });
    }
  });
});
app.get("/api/test", (req, res) => {
  /*
    # authorization
      => req.header("authorization")
  */
  /*
    # url query
    http://localhost:5000/api/test?searchKeyword=111&user=999
     => req.query: { searchKeyword: '111', user: '999' }
  */
  const resData = [
    {
      bookId: 1,
      title: "자바스크립트 디자인패턴",
      author: "사이먼팀스",
      message:
        "디자인패턴으로 프레임워크, 라이브러리 파악하는데 도움이 됐습니다😝",
      url: "https://happyjy.netlify.app/",
    },
    {
      bookId: 2,
      title: "자바스크립트 데이터구조, 알고리즘",
      author: "로이아니 그로네트",
      message:
        "데이터구조, 알고리즘으로 데이터를 다루는 방법을 배울 수 있었습니다.",
      url: "https://happyjy.netlify.app/",
    },
    {
      bookId: 3,
      title: "리팩터링2판",
      author: "마틴파울러",
      message: `예제가 javascript코드로 되어 있으며 볼 예정입니다.
        레거시코드가 많은 회사에서 이 책을 잘 활용하면 좋을것 같습니다.`,
      url: "https://happyjy.netlify.app/",
    },
  ];
  console.log('### app.get("/api/test")', resData);
  res.send(resData);
});
app.get("/api/test1", (req, res) => {
  console.log("### /api/test1");
  console.log(`### req.params - `, req.params);

  pool.getConnection((err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      connection.query("select * from users", function (err, results) {
        console.log("### /api/test1 > select * from users", results[1]);
        res.send(results[1]);
        if (err) throw err;
      });
    }
  });

  // connection.query("select * from users", function (err, results) {
  //   console.log("### /api/test1 > select * from users", results[0]);
  //   res.send(results);
  //   if (err) throw err;
  // });
});

// # require: sql query
const {
  loginSql,
  findUserSql,
  updateUserProfileImgUrlSql,
  getUserCoupleByTokenSql,
  getUserByEmailSql,
  requestCoupleSql,
  updateRequestCoupleUserSql,
  getPartnerCoupleByUserIdSql,
  updateCoupleStatusSql,
  getUserByTokenSql,
  getUsersByCoupleIdSql,
  updateDateRecordCoupleIdSql,
  selectDateRecordListByCoupleIdSql,
  selectDateRecordListByUserIdSql,
  getCoupleStatus,
  selectDateRecordByDateRecordIdQuery,
  selectDateRecordListByCoupleIdPaginatedSql,
} = require("./sql");

/*
  USER API
*/
// # USER - LOGIN
app.post("/api/login", async (req, res) => {
  console.log("#########################");
  console.log('### app.post("/api/login"');
  console.log("#########################");
  const reqParam = req?.body.param;
  const email = reqParam.email;
  const nickname = reqParam.nickname;
  const birthday = reqParam.birthday;
  const gender = reqParam.gender;
  const profileImageUrl = reqParam.profileImageUrl;
  const thumbnailImageUrl = reqParam.thumbnailImageUrl;

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      console.log("connection");
      const resultQueryFindUserResult = await new Promise((resolve, reject) => {
        connection.query(findUserSql, [email], (err, results, field) => {
          if (err) throw err;
          resolve(results);
        });
      });
      const responseValue = {};
      console.log({ resultQueryFindUserResult });
      console.log({
        "resultQueryFindUserResult[0]": resultQueryFindUserResult[0],
      });
      if (!resultQueryFindUserResult.length) {
        // 계정이 없는 경우
        console.log("계정이 없는 경우");
        const jwtToken = jwt.sign(
          { id: reqParam.email },
          process.env.PRIVATE_KEY
        );
        const token = jwtToken;

        connection.query(
          loginSql,
          [
            token,
            email,
            nickname,
            birthday,
            gender,
            profileImageUrl,
            thumbnailImageUrl,
          ],
          (err, results, field) => {
            if (err) throw err;
            responseValue.token = jwtToken;
            console.log("### 계정이 없는 경우 > responseValue", responseValue);
            res.send(responseValue);
          }
        );
      } else {
        // 계정이 있는 경우
        console.log("### 계정이 있는 경우");

        connection.query(
          updateUserProfileImgUrlSql,
          [
            // resultQueryFindUserResult[0].user_id,
            resultQueryFindUserResult[0].token,
            email,
            nickname,
            birthday,
            gender,
            profileImageUrl,
            thumbnailImageUrl,
            email,
          ],
          (err, results, field) => {
            if (err) throw err;
            responseValue.token = resultQueryFindUserResult[0].token;
            console.log(
              `### 계정이 있는 경우 > responseValue: `,
              responseValue
            );
            res.send(responseValue);
          }
        );
      }
      connection.release();
    }
  });
});
// # USER - GETUSER(redux > auth > user)
app.get("/api/getUser", async (req, res) => {
  console.log("###########################");
  console.log('### app.post("/api/getUser"');
  console.log("###########################");
  const token = getAuthorization(req);
  let result = [];
  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      // # redux로 관리되는 정보
      //  * 커플 요청 전, 후 data type이 다르다.
      //  * 커플 요청 전에는 로그인 유저 정보 "하나의 정보만" 배열에 하나만 설정
      //  * 커플 요청 후에는 로그인 유저, 커플 요청한 파트너 "두명의 정보"가 배열에 설정
      const ownUserInfoRequested = await new Promise((resolve, reject) => {
        connection.query(
          getUserCoupleByTokenSql,
          [token, token],
          function (err, results) {
            if (err) throw err;
            resolve(results[0]);
          }
        );
      });
      // printQuery(getUserCoupleByTokenSql, [token, token]);

      // 커플 요청 전(유저 검색/ 커플요청해야 하는 상태)
      if (!ownUserInfoRequested) {
        const ownUserInfoSolo = await new Promise((resolve, reject) => {
          connection.query(getUserByTokenSql, [token], function (err, results) {
            if (err) throw err;
            resolve(results[0]);
          });
        });
        // printQuery(getUserByTokenSql, [token]);

        result.push(ownUserInfoSolo);
      } else {
        // 커플 요청 후
        const partnerUserInfo = await new Promise((resolve, reject) => {
          connection.query(
            getPartnerCoupleByUserIdSql,
            [ownUserInfoRequested.partner, ownUserInfoRequested.partner],
            function (err, results) {
              if (err) throw err;
              resolve(results[0]);
            }
          );
        });
        result.push(ownUserInfoRequested);
        result.push(partnerUserInfo);
      }

      res.send(result);
    }
    connection.release();
  });
});

/*
  COUPLE API
*/
// # COUPLE - REQUEST COUPLE
app.get("/api/couple/request", async (req, res) => {
  console.log("#################################");
  console.log('### app.get("/api/couple/request"');
  console.log("#################################");

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      const token = getAuthorization(req);
      let { reqestUserId, receiveUserId } = req.query;
      let coupleId;
      try {
        const reqCoupleResult = await new Promise((resolve, reject) => {
          connection.query(
            requestCoupleSql,
            [reqestUserId, receiveUserId],
            (err, result, fields) => {
              if (err) throw err;
              resolve({ result, fields });
            }
          );
        });

        coupleId = reqCoupleResult.result.insertId;
        // 요청한 사람: reqestUserId
        await new Promise((resolve, reject) => {
          connection.query(
            updateRequestCoupleUserSql,
            [coupleId, reqestUserId],
            (err, result, fields) => {
              if (err) throw err;
              resolve({ result, fields });
            }
          );
        });
        // 요청받을 사람: receiveUserId
        await new Promise((resolve, reject) => {
          connection.query(
            updateRequestCoupleUserSql,
            [coupleId, receiveUserId],
            (err, result, fields) => {
              if (err) throw err;
              resolve({ result, fields });
            }
          );
        });

        let result = [];
        const ownUserInfoRequested = await new Promise((resolve, reject) => {
          connection.query(
            getUserCoupleByTokenSql,
            [token, token],
            function (err, results) {
              if (err) throw err;
              resolve(results[0]);
            }
          );
        });

        const partnerUserInfo = await new Promise((resolve, reject) => {
          connection.query(
            getPartnerCoupleByUserIdSql,
            [ownUserInfoRequested.partner, ownUserInfoRequested.partner],
            function (err, results) {
              if (err) throw err;
              resolve(results[0]);
            }
          );
        });
        result.push(ownUserInfoRequested);
        result.push(partnerUserInfo);

        res.send(result);
        // res.send({
        //   status: "SUCCESS",
        //   result: {
        //     insertId: reqCoupleResult.result.insertId,
        //     serverStatus: reqCoupleResult.result.serverStatus,
        //   },
        // });
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });
});
// # COUPLE - ACCEPT COUPLE
app.get("/api/couple/accept", async (req, res) => {
  console.log("################################");
  console.log('### app.get("/api/couple/accept"');
  console.log("################################");

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      const coupleId = req.query.coupleId;
      const status = 1; // # couplse request: 0: request, 1: accept

      // COUPLE status COUPLE Table
      const result = await new Promise((resolve, reject) => {
        connection.query(
          updateCoupleStatusSql,
          [status, coupleId],
          (err, result, fields) => {
            if (err) throw err;
            resolve(result);
          }
        );
      });

      // get user_id 2개 by couple_id
      const result1 = await new Promise((resolve, reject) => {
        connection.query(
          getUsersByCoupleIdSql,
          [coupleId],
          (err, result, fields) => {
            if (err) throw err;
            resolve(result[0]);
          }
        );
      });

      // update couple_id feild dateRecord Table
      const result2 = await new Promise((resolve, reject) => {
        connection.query(
          updateDateRecordCoupleIdSql,
          [coupleId, result1.couple1_id, result1.couple2_id],
          (err, result, fields) => {
            if (err) throw err;
            resolve(result);
          }
        );
      });

      res.send({ coupleId, status });
    }
    connection.release();
  });
});
// # COUPLE - SEARCH USER BY EMAIL
app.get("/api/getUser/email", async (req, res) => {
  console.log("################################");
  console.log('### app.get("/api/getUser/email"');
  console.log("################################");

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      connection.query(
        getUserByEmailSql(req.query.email),
        [],
        function (err, results) {
          if (err) throw err;
          res.send(results);
        }
      );
    }
    connection.release();
  });
});

/*
  DATE RECORD API
*/
// # DATE - RECORD PAGINATED SELECT LIST
app.get("/api/dateRecordPaginated", async (req, res) => {
  console.log("#######################################################");
  console.log("### DATE - record select list, /api/dateRecordPaginated");
  console.log("#######################################################");

  const token = req.header("authorization").split(" ")[1];
  if (!req.query.searchOption) {
    res.send({ status: "FAIL" });
    return;
  }

  const searchOption = JSON.parse(req.query.searchOption);
  const pagination = JSON.parse(req.query.pagination);

  const endOfRange = searchOption.rangeDate[1];
  const splitedEndOfRange = endOfRange.split("-");
  const lastDateEndOfRange = new Date(
    splitedEndOfRange[0],
    splitedEndOfRange[1],
    0
  ).getDate();

  const rowCountParam = [
    token,
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
  ];
  const coupleDateRecordListParam = [
    searchOption.rangeDate[0] + "-01",
    token,
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
    pagination.gridListNum,
    pagination.gridOffset,
    ...rowCountParam,
  ];
  // const couplePlace;
  // const coupleImage;
  const coupleSqlParam = [...coupleDateRecordListParam];
  // console.log({ coupleSqlParam });

  const singleDateRecordListParam = [
    pagination.gridOffset,
    searchOption.rangeDate[0] + "-01",
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
  ];
  const singleSqlParam = [...singleDateRecordListParam];

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      try {
        const resultGetCoupleStatus = await new Promise((resolve, reject) => {
          connection.query(
            getCoupleStatus,
            [token, token],
            function (err, results) {
              if (err) throw err;
              resolve(results[0]);
            }
          );
        });

        let result;
        if (resultGetCoupleStatus && resultGetCoupleStatus.status == 1) {
          console.log("### 커플 인증 후 - 데이트리스트 pagnination ###");
          // 커플 인증 후
          printQuery(
            selectDateRecordListByCoupleIdPaginatedSql(searchOption),
            coupleSqlParam
          );
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectDateRecordListByCoupleIdPaginatedSql(searchOption),
              coupleSqlParam,
              function (err, results) {
                if (err) throw err;
                resolve(results);
              }
            );
          });
        } else {
          console.log("### 커플 인증 전 - 데이트리스트 pagnination ###");
          // 커플 인증 전
          printQuery(
            selectDateRecordListByUserIdSql(searchOption),
            singleSqlParam
          );
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectDateRecordListByUserIdSql(searchOption),
              singleSqlParam,
              function (err, results) {
                if (err) throw err;
                resolve(results);
              }
            );
          });
        }
        res.send(result);
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });
});
// # DATE - RECORD SELECT LIST
app.get("/api/dateRecord", async (req, res) => {
  console.log("##############################################");
  console.log("### DATE - record select list, /api/dateRecord");
  console.log("##############################################");

  const token = req.header("authorization").split(" ")[1];
  if (!req.query.searchOption) {
    res.send({ status: "FAIL" });
    return;
  }

  const searchOption = JSON.parse(req.query.searchOption);

  const endOfRange = searchOption.rangeDate[1];
  const splitedEndOfRange = endOfRange.split("-");
  const lastDateEndOfRange = new Date(
    splitedEndOfRange[0],
    splitedEndOfRange[1],
    0
  ).getDate();

  let selectParam1 = [
    searchOption.rangeDate[0] + "-01",
    token,
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
  ];
  let selectParam2 = [
    searchOption.rangeDate[0] + "-01",
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
  ];

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      try {
        const resultGetCoupleStatus = await new Promise((resolve, reject) => {
          connection.query(
            getCoupleStatus,
            [token, token],
            function (err, results) {
              if (err) throw err;
              resolve(results[0]);
            }
          );
        });

        let result;
        if (resultGetCoupleStatus && resultGetCoupleStatus.status == 1) {
          console.log("### 커플 인증 후 - 데이트리스트 ###");
          // 커플 인증 후 getQuery
          printQuery(
            selectDateRecordListByCoupleIdSql(searchOption),
            selectParam1
          );
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectDateRecordListByCoupleIdSql(searchOption),
              selectParam1,
              function (err, results) {
                if (err) throw err;
                resolve(results);
              }
            );
          });
        } else {
          console.log("### 커플 인증 전 - 데이트리스트 ###");
          // 커플 인증 전
          printQuery(
            selectDateRecordListByUserIdSql(searchOption),
            selectParam2
          );
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectDateRecordListByUserIdSql(searchOption),
              selectParam2,
              function (err, results) {
                if (err) throw err;
                resolve(results);
              }
            );
          });
        }
        res.send(result);
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });
});

app.get("/api/dateRecordDetail", async (req, res) => {
  console.log("######################################################");
  console.log("### DATE - record select detail, /api/dateRecordDetail");
  console.log("######################################################");

  const token = req.header("authorization").split(" ")[1];
  if (!token) {
    res.send({ status: "FAIL" });
    return;
  }

  const dateId = req.query.dateId;
  console.log({ dateId, token });

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      try {
        console.log({ selectDateRecordByDateRecordIdQuery });
        const resultselectDateRecordListByCoupleIdSql = await new Promise(
          (resolve, reject) => {
            connection.query(
              selectDateRecordByDateRecordIdQuery,
              [dateId, dateId, dateId],
              function (err, results) {
                if (err) throw err;
                resolve(results);
              }
            );
          }
        );

        console.log({
          resultselectDateRecordListByCoupleIdSql1:
            resultselectDateRecordListByCoupleIdSql[0],
          resultselectDateRecordListByCoupleIdSql2:
            resultselectDateRecordListByCoupleIdSql[1],
          resultselectDateRecordListByCoupleIdSql3:
            resultselectDateRecordListByCoupleIdSql[2],
        });
        res.send(resultselectDateRecordListByCoupleIdSql);
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });
});

const upload = multer({ dest: "./upload" });
const s3Upload = require("./s3_upload");

// # DATE - RECORD INSERT
//  * imageFile: server req시 설정된 필드명
app.post("/api/dateRecord", s3Upload.array("imageFile"), async (req, res) => {
  console.log(`##############################################`);
  console.log(`### app.post("/api/dateRecord" - RECORD INSERT`);
  console.log(`##############################################`);

  const token = req.header("authorization").split(" ")[1];
  const hasUser = "select * from users where token = ?";
  let resultHasUser = "";

  // 유저 확인
  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      try {
        const result = await new Promise((resolve, reject) => {
          connection.query(hasUser, [token], (err, results, fields) => {
            if (err) throw err;
            resultHasUser = results;
            resolve(results);
          });
        });

        console.log(`### hasUser Result: ${result}`);
        if (result.length == 0) {
          res.send("not exist user");
          return;
        }
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });

  // insert 로직
  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      let insertDateRecord = `
      INSERT INTO dateRecord(couple_id, user_id, dateTime, title, description)
      SELECT (SELECT couple_id
                FROM couple
               WHERE 1=1
                 AND couple1_id = (SELECT user_id FROM users WHERE token= ?)
                  OR couple2_id = (SELECT user_id FROM users WHERE token= ?)
                ) as couple_id,
                user_id,
                ? as dateTime,
                ? as title,
                ? as description
        FROM users
      WHERE 1=1
        AND token= ?
    `;

      // let insertDateRecord = `INSERT INTO dateRecord(couple_id, user_id, dateTime, title, description)
      //     SELECT couple_id, (SELECT user_id FROM users WHERE token= ?) as user_id, ? as dateTime, ? as title, ? as description
      //       FROM couple
      //      WHERE 1=1
      //        AND couple1_id = (SELECT user_id FROM users WHERE token= ?)
      //         OR couple2_id = (SELECT user_id FROM users WHERE token= ?)
      // `;
      let insertPlace =
        "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
      let insertDateImage =
        "INSERT INTO dateImage(dateRecord_id, dateImage_name) VALUES (?, ?);";

      let dateTime = req.body.dateTime;
      let title = req.body.title;
      let description = req.body.description;
      let placeList = JSON.parse(req.body.placeList);
      let images = req.files;
      console.log(`#파일업로드: `, images);
      let insertDateRecordParams = [
        token,
        token,
        dateTime,
        title,
        description,
        token,
      ];

      let insertDateRecordid;

      try {
        await connection.query(
          insertDateRecord,
          insertDateRecordParams,
          (err, results, fields) => {
            console.log(`### result insertDateRecord`);
            insertDateRecordid = results.insertId;
            if (err) throw err;

            for (var i = 0; i < placeList.length; i++) {
              let insertParam = [
                insertDateRecordid,
                placeList[i].placeName,
                placeList[i].address,
                placeList[i].latLong,
              ];
              connection.query(
                insertPlace,
                insertParam,
                (err, results, field) => {
                  console.log(`### result insertPlace`);
                  if (err) throw err;
                }
              );
            }

            for (var j = 0; j < images.length; j++) {
              let insertParam = [insertDateRecordid, images[j].location];
              connection.query(
                insertDateImage,
                insertParam,
                (err, results, field) => {
                  console.log(`### result insertDateImage`);
                  if (err) throw err;
                }
              );
            }
            res.send(results);
          }
        );
      } catch (error) {
        throw error;
      }
    }
    connection.release();
  });
});

// # DATE - RECORD UPDATE
app.patch(
  "/api/dateRecord/:id",
  s3Upload.array("newImageFileList"),
  (req, res) => {
    console.log(`###################################`);
    console.log(`### app.patch("/api/dateRecord/:id"`);
    console.log(`###################################`);

    pool.getConnection(async (err, connection) => {
      if (err) {
        switch (err.code) {
          case "PROTOCOL_CONNECTION_LOST":
            console.error("Database connection was closed.");
            break;
          case "ER_CON_COUNT_ERROR":
            console.error("Database has too many connections.");
            break;
          case "ECONNREFUSED":
            console.error("Database connection was refused.");
            break;
        }
      } else {
        // connection
        console.log("connection");
        let updateDateRecord =
          "UPDATE DATERECORD SET title = ?, description = ? where dateRecord_id = ?;";
        let insertPlace =
          "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
        let deletePlace = "UPDATE PLACE SET isDeleted = 1 where place_id = ?;";
        let insertDateImage =
          "INSERT INTO dateImage(dateRecord_id, dateImage_name) VALUES (?, ?);";
        let deleteDateImage =
          "update dateImage set isDeleted = ? where dateImage_id = ?";

        const editDateRecordId = req.params.id;
        let title = req.body.title;
        let description = req.body.description;
        let delPlaceList = JSON.parse(req.body.delPlaceList);
        let addPlaceList = JSON.parse(req.body.addPlaceList);
        let delImageFileIdList = JSON.parse(req.body.delImageFileIdList);
        let images = req.files;
        console.log(`#파일업로드: `, images);
        let updateDateRecordParams = [title, description, req.params.id];

        connection.query(
          updateDateRecord,
          updateDateRecordParams,
          (err, results, field) => {
            if (err) throw err;
          }
        );

        for (var i = 0; i < addPlaceList.length; i++) {
          let insertParam = [
            editDateRecordId,
            addPlaceList[i].placeName,
            addPlaceList[i].address,
            addPlaceList[i].latLong,
          ];
          connection.query(insertPlace, insertParam, (err, results, field) => {
            if (err) throw err;
          });
        }

        for (var i = 0; i < delPlaceList.length; i++) {
          let updatePlaceParams = [delPlaceList[i].id];
          connection.query(
            deletePlace,
            updatePlaceParams,
            (err, results, field) => {
              if (err) throw err;
            }
          );
        }
        for (var j = 0; j < images.length; j++) {
          let insertParam = [editDateRecordId, images[j].location];
          connection.query(
            insertDateImage,
            insertParam,
            (err, results, field) => {
              if (err) throw err;
            }
          );
        }
        for (var k = 0; k < delImageFileIdList.length; k++) {
          let insertParam = [1, delImageFileIdList[k]];
          connection.query(
            deleteDateImage,
            insertParam,
            (err, results, field) => {
              if (err) throw err;
            }
          );
        }

        connection.query(
          `SELECT *
             FROM DATERECORD
            WHERE ISDELETED = 0
              AND DATERECORD_ID = ?;

            SELECT *
              FROM PLACE
             WHERE ISDELETED = 0
               AND DATERECORD_ID = ?`,
          [editDateRecordId, editDateRecordId],
          (err, results) => {
            if (err) throw err;
            console.log("edit after: ", results);
            res.send(results);
          }
        );
      }
      connection.release();
    });
  }
);

// # DATE - RECORD DELETE
app.delete("/api/dateRecord/:id", (req, res) => {
  console.log(`####################################`);
  console.log(`### app.delete("/api/dateRecord/:id"`);
  console.log(`####################################`);

  pool.getConnection(async (err, connection) => {
    if (err) {
      switch (err.code) {
        case "PROTOCOL_CONNECTION_LOST":
          console.error("Database connection was closed.");
          break;
        case "ER_CON_COUNT_ERROR":
          console.error("Database has too many connections.");
          break;
        case "ECONNREFUSED":
          console.error("Database connection was refused.");
          break;
      }
    } else {
      // connection
      let deleteDateRecord =
        "UPDATE DATERECORD SET isDeleted = 1 where dateRecord_id = ?;";
      let deletePlace =
        "UPDATE PLACE SET isDeleted = 1 where dateRecord_id = ?;";

      let updatePlaceParams = [req.params.id];
      connection.query(
        deleteDateRecord,
        updatePlaceParams,
        (err, results, field) => {
          if (err) throw err;
        }
      );
      connection.query(
        deletePlace,
        updatePlaceParams,
        (err, results, field) => {
          if (err) throw err;
          res.send(results);
        }
      );
    }
    connection.release();
  });
});

// # 라우트 설정
// heroku로 배포하기 위한 설정.
// build foler: npm run build로 생성된 static한 파일들
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build" + "/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
