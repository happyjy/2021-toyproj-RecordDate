const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
// aws.config.loadFromPath("./awsConfig.json");
console.log(">>> process.env.accessKeyId: ", process.env.accessKeyId);
console.log(">>> process.env.secretAccessKey: ", process.env.secretAccessKey);
console.log(">>> process.env.region: ", process.env.region);
const s3 = new aws.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

const s3Upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ourdatinghistory",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
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
