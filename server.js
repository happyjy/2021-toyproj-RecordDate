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

app.get("/api/books", (req, res) => {
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

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

const multer = require("multer");
const upload = multer({ dest: "./upload" });

app.get("/api/dateRecord", (req, res) => {
  connection.query(
    // "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
    `SELECT A.title, A.description, B.place_name
       FROM dateRecord as A
 INNER JOIN place as B
         ON A.dateRecord_id = B.dateRecord_id`,
    (err, rows, fields) => {
      console.log(rows);
      res.send(rows);
    }
  );
});

// app.use('/image', express.static('./upload'));

// app.post('/api/customers', upload.single('image'), (req, res) => {
//     let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
//     let image = '/image/' + req.file.filename;
//     let name = req.body.name;
//     let birthday = req.body.birthday;
//     let gender = req.body.gender;
//     let job = req.body.job;
//     let params = [image, name, birthday, gender, job];
//     connection.query(sql, params,
//         (err, rows, fields) => {
//             res.send(rows);
//         }
//     );
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
