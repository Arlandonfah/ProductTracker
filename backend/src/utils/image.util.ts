import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    if (![".jpg", ".jpeg", ".png"].includes(ext.toLowerCase())) {
      return cb(new Error("Seules les images sont autorisées"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const imageUpload = (file: Express.Multer.File) => {
  return `/uploads/${file.filename}`;
};
