require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
console.log("### server.js > process.env.PORT: ", process.env.PORT);

app.use(cors());
app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
  console.log(req.query);
  res.send([
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
  ]);
});

// # DB connection
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
  multipleStatements: true,
});

// # require: sql query
const {
  loginSql,
  findUser,
  updateUserProfileImgUrl,
  getUserByToken,
  getUserByEmail,
} = require("./sql");

// # USER - LOGIN
app.post("/api/login", async (req, res) => {
  const reqParam = req?.body.param;
  const email = reqParam.email;
  const nickname = reqParam.nickname;
  const birthday = reqParam.birthday;
  const gender = reqParam.gender;
  const profileImageUrl = reqParam.profileImageUrl;
  const thumbnailImageUrl = reqParam.thumbnailImageUrl;

  const resultQueryFindUserResult = await new Promise((resolve, reject) => {
    connection.query(findUser, [email], (err, rows, field) => {
      if (err) throw err;
      // const findUserResult = rows;
      // 계정 여부에 따른 로그인 처리
      resolve(rows);
    });
  });

  const responseValue = {};
  if (!resultQueryFindUserResult.length) {
    // 계정이 없는 경우
    const jwtToken = jwt.sign({ id: reqParam.email }, process.env.PRIVATE_KEY);
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
      (err, rows, field) => {
        if (err) throw err;
        responseValue.token = jwtToken;
        res.send(responseValue);
      }
    );
  } else {
    // 계정이 있는 경우
    connection.query(
      updateUserProfileImgUrl,
      [
        resultQueryFindUserResult[0].user_id,
        resultQueryFindUserResult[0].token,
        email,
        nickname,
        birthday,
        gender,
        profileImageUrl,
        thumbnailImageUrl,
      ],
      (err, rows, field) => {
        if (err) throw err;
        responseValue.token = resultQueryFindUserResult[0].token;
        res.send(responseValue);
      }
    );
  }
});

// # USER - GETUSER
app.get("/api/getUser", async (req, res) => {
  // const reqParamsToken = req?.query.token;
  const token = getAuthorization(req);
  connection.query(getUserByToken, [token], function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

// # USER - SEARCH USER BY EMAIL
app.get("/api/getUser/email", async (req, res) => {
  console.log("### /api/getUser/email");
  // res.send(["반환"]);
  console.log(req.query);
  const selectParam = [req.query.email];
  console.log("### /api/getUser/email: ", getUserByEmail(req.query.email));
  connection.query(getUserByEmail(req.query.email), [], function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

// # DATE - RECORD SELECT
app.get("/api/dateRecord", (req, res) => {
  const token = req.header("authorization").split(" ")[1];
  const searchOption = JSON.parse(req.query.searchOption);

  console.log("### searchOption: ", searchOption);
  const endOfRange = searchOption.rangeDate[1];
  const splitedEndOfRange = endOfRange.split("-");
  const lastDateEndOfRange = new Date(
    splitedEndOfRange[0],
    splitedEndOfRange[1],
    0
  ).getDate();

  let selectParam = [
    searchOption.rangeDate[0] + "-01",
    token,
    token,
    searchOption.rangeDate[0] + "-01",
    searchOption.rangeDate[1] + "-" + lastDateEndOfRange + " 23:59:59",
  ];

  // NUMBERING
  // const numbering
  const selectQuery = `
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
      WHERE ISDELETED = 0;`;

  connection.query(selectQuery, selectParam, function (err, rows) {
    if (err) throw err;
    res.send(rows);
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
      connection.query(hasUser, [token], (err, rows, fields) => {
        if (err) throw err;
        resultHasUser = rows;
        resolve(rows);
      });
    });

    if (result.length == 0) {
      res.send("not exist user");
      return;
    }
  } catch (error) {
    throw error;
  }

  let insertDateRecord = `INSERT INTO dateRecord(couple_id, dateTime, title, description)
      SELECT couple_id, ? as dateTime, ? as title, ? as description
        FROM couple
       WHERE 1=1
         AND couple1_id = (SELECT user_id FROM users WHERE token= ?)
          OR couple2_id = (SELECT user_id FROM users WHERE token= ?)
  `;
  let insertPlace =
    "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
  let insertDateImage =
    "INSERT INTO dateImage(dateRecord_id, dateImage_name) VALUES (?, ?);";

  let dateTime = req.body.dateTime;
  let title = req.body.title;
  let description = req.body.description;
  let placeList = JSON.parse(req.body.placeList);
  let images = req.files;
  let insertDateRecordParams = [dateTime, title, description, token, token];

  let insertDateRecordid;

  try {
    await connection.query(
      insertDateRecord,
      insertDateRecordParams,
      (err, rows, fields) => {
        insertDateRecordid = rows.insertId;
        if (err) throw err;

        for (var i = 0; i < placeList.length; i++) {
          let insertParam = [
            insertDateRecordid,
            placeList[i].placeName,
            placeList[i].address,
            placeList[i].latLong,
          ];
          connection.query(insertPlace, insertParam, (err, rows, field) => {
            if (err) throw err;
          });
        }

        for (var j = 0; j < images.length; j++) {
          let insertParam = [
            insertDateRecordid,
            "/image/" + images[j].filename,
          ];
          connection.query(insertDateImage, insertParam, (err, rows, field) => {
            if (err) throw err;
          });
        }
        res.send(rows);
      }
    );
  } catch (error) {
    console.log(error);
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
    // console.log("### nextlevel: " + req.body.addPlaceList);
    let addPlaceList = JSON.parse(req.body.addPlaceList);
    let delImageFileIdList = JSON.parse(req.body.delImageFileIdList);
    let images = req.files;
    let updateDateRecordParams = [title, description, req.params.id];

    console.log("### newImageFileList: ", images);
    console.log("param: ", { title, description, delPlaceList, addPlaceList });

    connection.query(
      updateDateRecord,
      updateDateRecordParams,
      (err, rows, field) => {
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
      connection.query(insertPlace, insertParam, (err, rows, field) => {
        if (err) throw err;
      });
    }

    for (var i = 0; i < delPlaceList.length; i++) {
      let updatePlaceParams = [delPlaceList[i].id];
      connection.query(deletePlace, updatePlaceParams, (err, rows, field) => {
        if (err) throw err;
      });
    }
    for (var j = 0; j < images.length; j++) {
      let insertParam = [editDateRecordId, "/image/" + images[j].filename];
      connection.query(insertDateImage, insertParam, (err, rows, field) => {
        if (err) throw err;
      });
    }
    for (var k = 0; k < delImageFileIdList.length; k++) {
      let insertParam = [1, delImageFileIdList[k]];
      connection.query(deleteDateImage, insertParam, (err, rows, field) => {
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
        console.log("### select dateRecord, place AFTER update: ", results);
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
  connection.query(deleteDateRecord, updatePlaceParams, (err, rows, field) => {
    if (err) throw err;
  });
  connection.query(deletePlace, updatePlaceParams, (err, rows, field) => {
    if (err) throw err;
    res.send(rows);
  });
});

connection.connect();
app.listen(port, () => console.log(`Listening on port ${port}`));
