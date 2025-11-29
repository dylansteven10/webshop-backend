// routes/user.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  updateProfile,
  uploadProfilePhoto
} from "../controllers/userController.js";

const router = express.Router();

// =========================
// 📁 Configuración de Multer
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // carpeta ya garantizada por server.js
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

// Validar tipos de imagen
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato no permitido"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// =========================
// 📝 Actualizar perfil
// PUT /api/users/:id
// =========================
router.put("/:id", updateProfile);

// =========================
// 📸 Subir foto de perfil
// PUT /api/users/:id/photo
// =========================
router.put("/:id/photo", upload.single("foto"), uploadProfilePhoto);

export default router;
