import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const __dirname = path.resolve(); //give the path of that place where `node index.js` is running or root directory path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"backend","upload"));
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png||image\/webp/;

  const extname = path.extname(file.originalname);
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", function (req, res) {
  uploadSingleImage(req, res, function(err) {
    if (err) {
      
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/upload/${req.file.filename}`,
      });
    } else {
      
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
