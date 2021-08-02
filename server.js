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
      // console.log(results);
      res.send(results);
    }
  );
});

const multer = require("multer");
const upload = multer({ dest: "./upload" });
app.use("/image", express.static("upload"));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },

//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// var upload = multer({ storage: storage });

// app.post("/api/dateRecord", upload.single("imageFile"), (req, res) => {
app.post("/api/dateRecord", upload.array("imageFile"), (req, res) => {
  // console.log("# req.file");
  // console.log(req?.file);
  // filename
  // path
  console.log("# req.files");
  console.log(req?.files);

  let insertDateRecord =
    "INSERT INTO dateRecord(title, description) VALUES (?, ?);";
  let insertPlace =
    "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
  let insertDateImage =
    "INSERT INTO dateImage(dateRecord_id, dateImage_name) VALUES (?, ?);";
  let title = req.body.title;
  let description = req.body.description;
  let placeList = JSON.parse(req.body.placeList);
  let images = req.files;
  let insertDateRecordParams = [title, description];

  let insertDateRecordid;
  connection.query(
    insertDateRecord,
    insertDateRecordParams,
    (err, rows, fields) => {
      console.log(rows);
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
        let insertParam = [insertDateRecordid, "/image/" + images[j].filename];
        connection.query(insertDateImage, insertParam, (err, rows, field) => {
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
  let insertPlace =
    "INSERT INTO place(dateRecord_id, place_name, address, latLong) VALUES (?, ?, ?, ?);";
  let deletePlace = "UPDATE PLACE SET isDeleted = 1 where place_id = ?;";

  const editDateRecordId = req.params.id;
  let title = req.body.title;
  let delPlaceList = req.body.delPlaceList;
  let addPlaceList = req.body.addPlaceList;
  let description = req.body.description;
  let updateDateRecordParams = [title, description, req.params.id];

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
      res.send(results);
    }
  );
});

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

// app.get('/api/customers', (req, res) => {
//   connection.query(
//     "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
//     (err, rows, fields) => {
//         res.send(rows);
//     }
// );
// });

// app.post("/api/customers", upload.single("image"), (req, res) => {
//   let sql = "INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)";
//   let image = "/image/" + req.file.filename;
//   let name = req.body.name;
//   let birthday = req.body.birthday;
//   let gender = req.body.gender;
//   let job = req.body.job;
//   let params = [image, name, birthday, gender, job];
//   connection.query(sql, params, (err, rows, fields) => {
//     res.send(rows);
//   });
// });

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
