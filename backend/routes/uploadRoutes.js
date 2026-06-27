import { Router } from "express";
import path from "path";
import multer from "multer";

// image upload

const uploadRouter = Router();

// store
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// check file-type - only images allowed
function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png/; // regex of what to allow
  const extname = fileTypes.test(path.extname(file.originalname)).toLowerCase();

  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return (cb, null);
  } else {
    cb("Images only!");
  }
}

// upload
const upload = multer({
  storage,
});

// route
uploadRouter.post("/", upload.single("image"), (req, res) => {
  res.send({ message: "Image uploaded!", image: `/${req.file.path}` });
});

export default uploadRouter;
