const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const supportedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
    ];
    const extension = path.extname(file.originalname);
    if (supportedExtensions.includes(extension)) {
      cb(null, `${Date.now()}-${file.fieldname}${extension}`);
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/attachments");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(null, `${Date.now()}-${file.fieldname}${extension}`);
  },
});

const imageUpload = multer({ storage: imageStorage });
const attachmentUpload = multer({ storage: fileStorage });

module.exports = {
  imageUpload,
  attachmentUpload,
};
