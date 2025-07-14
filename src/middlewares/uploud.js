import path from 'node:path';
import multer from 'multer';

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src', "tmp"));
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

const upload = multer({ storage });
 
export {upload}