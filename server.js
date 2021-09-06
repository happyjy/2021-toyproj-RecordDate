// console.log(`### process.env.NODE_ENV: ${process.env.NODE_ENV}`);
require("dotenv").config();
const httpProxy = require("http-proxy");
httpProxy.createProxyServer({
  target: "https://ourdatinghistory.herokuapp.com/",
  toProxy: true,
  changeOrigin: true,
  xfwd: true,
});
console.log("### PRIVATE_KEY: ", process.env.PRIVATE_KEY);
console.log("### PK1: ", process.env.PK1);
console.log("### PK2: ", process.env.PK2);

// file system
const fs = require("fs");
// client, server port 다름으로 보안상 문제 해결
const cors = require("cors");
// express 모듈 불러오기
const express = require("express");
// path 모듈
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
// express 객체 생성
const app = express();
var env = process.argv[2] || "prod";
const { dbConfig, poolType } = require("./dbConnection");

// # mysql connection 설정
const mysql = require("mysql");
let connection;
let pool = poolType;

if (env !== "dev") {
  console.log("### prod mode ###");
  //   // # production level 설정
  //   // # DB connection - prod mode

  // 리액트 정적 파일 제공
  console.log(
    `# 리액트 정적 파일 제공: ${path.join(__dirname, "/client/build")}`
  );
  app.use(express.static(path.join(__dirname, "/client/build")));
  // // 라우트 설정
  // // build foler: npm run build로 생성된 static한 파일들
  // app.get("*", (req, res) => {
  //   console.log(
  //     `# 라우트 설정: ${path.join(__dirname + "/client/build" + "/index.html")}`
  //   );
  //   res.sendFile(path.join(__dirname + "/client/build" + "/index.html"));
  // });
}

// else {
//   // # DB connection - dev mode
//   console.log("### dev mode ###");

//   // connection = dbConfig;
//   // connection.connect(function () {
//   //   connection.query("select * from users", function (err, results) {
//   //     console.log("### dev mode > select * from users", results[0]);
//   //     if (err) throw err;
//   //   });
//   // });

//   // console.log({dbconfig});
//   // console.log(dbconfig());
//   // connection = dbconfig();
// }

app.use(cors());
app.use(express.json());

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
app.use("/api/test", (req, res) => {
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
app.use("/api/test1", (req, res) => {
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
  selectQueryByCoupleId,
  selectQueryByUserId,
  getCoupleStatus,
} = require("./sql");

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

        // todo heroku에서 process.env.PRIVATE_KEY가 undefined됨.
        const jwtToken = jwt.sign(
          { id: reqParam.email },
          process.env.PRIVATE_KEY || "UdO1OZgf0skCS2T3NTCrzXVb8BMMYzl6"
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
    }
  });
});
// # USER - GETUSER(redux > auth > user)
app.use("/api/getUser", async (req, res) => {
  console.log("######################");
  console.log('app.post("/api/getUser"');
  console.log("######################");
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

      // 커플 요청 전(유저 검색/ 커플요청해야 하는 상태)
      if (!ownUserInfoRequested) {
        const ownUserInfoSolo = await new Promise((resolve, reject) => {
          connection.query(getUserByTokenSql, [token], function (err, results) {
            if (err) throw err;
            resolve(results[0]);
          });
        });
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
  });
});

// # COUPLE - REQUEST COUPLE
app.use("/api/couple/request", async (req, res) => {
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
});
// # COUPLE - ACCEPT COUPLE
app.use("/api/couple/accept", async (req, res) => {
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
});
// # COUPLE - SEARCH USER BY EMAIL
app.use("/api/getUser/email", async (req, res) => {
  connection.query(
    getUserByEmailSql(req.query.email),
    [],
    function (err, results) {
      if (err) throw err;
      res.send(results);
    }
  );
});

// # DATE - RECORD SELECT
app.use("/api/dateRecord", async (req, res) => {
  console.log("#########################################");
  console.log("### DATE - record select, /api/dateRecord");
  console.log("#########################################");

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
        const resultSelectQueryByCoupleId = await new Promise(
          (resolve, reject) => {
            connection.query(
              getCoupleStatus,
              [token, token],
              function (err, results) {
                if (err) throw err;
                resolve(results[0]);
              }
            );
          }
        );

        let result;
        if (
          resultSelectQueryByCoupleId &&
          resultSelectQueryByCoupleId.status == 1
        ) {
          console.log("### 커플 인증 후 - 데이트리스트 ###");
          // 커플 인증 후
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectQueryByCoupleId(searchOption),
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
          result = await new Promise((resolve, reject) => {
            connection.query(
              selectQueryByUserId(searchOption),
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
  });
});

// # 파일업로드
const multer = require("multer");
const { JsonWebTokenError } = require("jsonwebtoken");
const { getAuthorization } = require("./util");

const upload = multer({ dest: "./upload" });
app.use("/image", express.static("upload"));

// # DATE - RECORD INSERT
app.post("/api/dateRecord", upload.array("imageFile"), async (req, res) => {
  const token = req.header("authorization").split(" ")[1];
  const hasUser = "select * from users where token = ?";
  let resultHasUser = "";
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(hasUser, [token], (err, results, fields) => {
        if (err) throw err;
        resultHasUser = results;
        resolve(results);
      });
    });

    if (result.length == 0) {
      res.send("not exist user");
      return;
    }
  } catch (error) {
    throw error;
  }

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
        insertDateRecordid = results.insertId;
        if (err) throw err;

        for (var i = 0; i < placeList.length; i++) {
          let insertParam = [
            insertDateRecordid,
            placeList[i].placeName,
            placeList[i].address,
            placeList[i].latLong,
          ];
          connection.query(insertPlace, insertParam, (err, results, field) => {
            if (err) throw err;
          });
        }

        for (var j = 0; j < images.length; j++) {
          let insertParam = [
            insertDateRecordid,
            "/image/" + images[j].filename,
          ];
          connection.query(
            insertDateImage,
            insertParam,
            (err, results, field) => {
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
});

// # DATE - RECORD UPDATE
app.patch(
  "/api/dateRecord/:id",
  upload.array("newImageFileList"),
  (req, res) => {
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
      let insertParam = [editDateRecordId, "/image/" + images[j].filename];
      connection.query(insertDateImage, insertParam, (err, results, field) => {
        if (err) throw err;
      });
    }
    for (var k = 0; k < delImageFileIdList.length; k++) {
      let insertParam = [1, delImageFileIdList[k]];
      connection.query(deleteDateImage, insertParam, (err, results, field) => {
        if (err) throw err;
      });
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
);

// # DATE - RECORD DELETE
app.delete("/api/dateRecord/:id", (req, res) => {
  let deleteDateRecord =
    "UPDATE DATERECORD SET isDeleted = 1 where dateRecord_id = ?;";
  let deletePlace = "UPDATE PLACE SET isDeleted = 1 where dateRecord_id = ?;";

  let updatePlaceParams = [req.params.id];
  connection.query(
    deleteDateRecord,
    updatePlaceParams,
    (err, results, field) => {
      if (err) throw err;
    }
  );
  connection.query(deletePlace, updatePlaceParams, (err, results, field) => {
    if (err) throw err;
    res.send(results);
  });
});

// # 라우트 설정
// build foler: npm run build로 생성된 static한 파일들
app.get("*", (req, res) => {
  console.log(
    `# 라우트 설정: ${path.join(__dirname + "/client/build" + "/index.html")}`
  );
  res.sendFile(path.join(__dirname + "/client/build" + "/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
