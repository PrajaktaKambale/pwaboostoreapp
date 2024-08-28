import Contact from "../model/contact.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const ensureUploadsDirectoryExists = () => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Uploads directory created at:", uploadDir);
    } else {
      console.log("Uploads directory already exists at:", uploadDir);
    }
  } catch (error) {
    console.error("Error creating uploads directory:", error.message);
  }
};

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirectoryExists(); // Ensure directory exists before storing files
    const uploadPath = path.join(process.cwd(), "uploads");
    console.log("Storing file in directory:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF files are allowed.")
    );
  },
});

export const createContact = [
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("req.body", req.body);
      const { fullname, email, message } = req.body;
      let avatar = null;

      if (req.file) {
        avatar = req.file.path; //store file path in avatar column
        // avatar = {
        //   path: req.file.path, // Store the relative path
        //   filename: req.file.filename, // Store the filename
        // };
        console.log("Avatar info:", avatar);
      }

      const createdContact = new Contact({
        fullname,
        email,
        message,
        avatar,
      });

      await createdContact.save();

      res.status(201).json({
        message: "Contact created successfully",
        contact: {
          _id: createdContact._id,
          avatar: createdContact.avatar,
          fullname: createdContact.fullname,
          email: createdContact.email,
          message: createdContact.message,
        },
      });
    } catch (error) {
      console.error("Error: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
