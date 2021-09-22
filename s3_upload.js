const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// # 아마존 s3 서비스 모듈
//  * 사진 업로드를 위해서 아마존 s3 서비스 모듈 사용
const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

const s3Upload = multer({
  storage: multerS3({
    s3,
    bucket: "ourdatinghistory",
    acl: "public-read",
    key: function (req, file, callbackFunc) {
      console.log("### s3Upload > file: ", file);
      callbackFunc(
        null,
        Math.floor(Math.random() * 1000).toString() +
          Date.now() +
          "." +
          file.originalname.split(".").pop()
      );
    },
  }),
  limits: { fileSize: 1000 * 1000 * 10 },
});

module.exports = s3Upload;
