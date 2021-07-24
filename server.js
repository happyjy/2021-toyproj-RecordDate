const fs = require("fs");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
console.log("### server.js > process.env.PORT: ", process.env.PORT);

app.use(cors());
app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/api/books", (req, res) => {
//   res.send([
//     {
//       bookId: 1,
//       title: "자바스크립트 디자인패턴",
//       author: "사이먼팀스",
//       message:
//         "디자인패턴으로 프레임워크, 라이브러리 파악하는데 도움이 됐습니다😝",
//       url: "https://happyjy.netlify.app/",
//     },
//     {
//       bookId: 2,
//       title: "자바스크립트 데이터구조, 알고리즘",
//       author: "로이아니 그로네트",
//       message:
//         "데이터구조, 알고리즘으로 데이터를 다루는 방법을 배울 수 있었습니다.",
//       url: "https://happyjy.netlify.app/",
//     },
//     {
//       bookId: 3,
//       title: "리팩터링2판",
//       author: "마틴파울러",
//       message: `예제가 javascript코드로 되어 있으며 볼 예정입니다.
//           레거시코드가 많은 회사에서 이 책을 잘 활용하면 좋을것 같습니다.`,
//       url: "https://happyjy.netlify.app/",
//     },
//   ]);
// });

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

const multer = require("multer");
const upload = multer({ dest: "./upload" });
app.get("/api/dateRecord", (req, res) => {
  connection.query(
    `SELECT dateRecord_id,
            title,
            description,
            image 
       FROM DATERECORD 
      WHERE ISDELETED = 0; 
      
     SELECT place_id,
            dateRecord_id,
            place_name,
            latLong
       FROM PLACE 
      WHERE ISDELETED = 0`,
    function (err, results) {
      if (err) throw err;
      // const dateRecordList = results[0];
      // const placeList = results[1];
      console.log(results);
      res.send(results);
    }
  );
});

app.post("/api/dateRecord", (req, res) => {
  let insertDateRecord =
    "INSERT INTO dateRecord(title, description) VALUES (?, ?);";
  let insertPlace =
    "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
  let title = req.body.title;
  let description = req.body.description;
  let placeList = req.body.placeList;
  let insertDateRecordParams = [title, description];

  let insertDateRecordid;
  connection.query(
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
      res.send(rows);
    }
  );
});

app.patch("/api/dateRecord/:id", (req, res) => {
  let updateDateRecord =
    "UPDATE DATERECORD SET title = ?, description = ? where dateRecord_id = ?;";
  let updatePlace = "UPDATE PLACE SET place_name = ? where dateRecord_id = ?;";

  let title = req.body.title;
  let place = req.body.place;
  let description = req.body.description;
  let updateDateRecordParams = [title, description, req.params.id];
  let updatePlaceParams = [place, req.params.id];

  connection.query(
    updateDateRecord,
    updateDateRecordParams,
    (err, rows, field) => {
      if (err) throw err;
    }
  );
  connection.query(updatePlace, updatePlaceParams, (err, rows, field) => {
    if (err) throw err;
  });

  connection.query(
    "SELECT * from dateRecord; SELECT * from place; ",
    function (err, results) {
      if (err) throw err;
      const dateRecordList = results[0];
      const placeList = results[1];

      dateRecordList.map((date) => {
        return date;
      });

      res.send(results);
    }
  );
});

app.delete("/api/dateRecord/:id", (req, res) => {
  let deleteDateRecord =
    "UPDATE DATERECORD SET isDeleted = 1 where dateRecord_id = ?;";
  let deletePlace = "UPDATE PLACE SET isDeleted = 1 where dateRecord_id = ?;";

  let updatePlaceParams = [req.params.id];
  console.log(1);
  connection.query(deleteDateRecord, updatePlaceParams, (err, rows, field) => {
    console.log(2);
    if (err) throw err;
  });
  connection.query(deletePlace, updatePlaceParams, (err, rows, field) => {
    console.log(3);
    if (err) throw err;
    res.send(rows);
  });
});

// app.get('/api/customers', (req, res) => {
//   connection.query(
//     "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
//     (err, rows, fields) => {
//         res.send(rows);
//     }
// );
// });
// app.use('/image', express.static('./upload'));

app.post("/api/customers", upload.single("image"), (req, res) => {
  let sql = "INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)";
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

// app.delete('/api/customers/:id', (req, res) => {
//     let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
//     let params = [req.params.id];
//     connection.query(sql, params,
//         (err, rows, fields) => {
//             res.send(rows);
//         }
//     )
// });

// app.listen(port, () => console.log(`Listening on port ${port}`));

connection.connect();
app.listen(port, () => console.log(`Listening on port ${port}`));
