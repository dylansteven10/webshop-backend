// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, celular, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (nombre, apellido, celular, email, password) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, celular || null, email, hashedPassword]
    );

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "Usuario registrado con éxito", token });
  } catch (error) {
    console.error("❌ Error en /register:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("❌ Error en /login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      // No revelamos si existe o no → misma respuesta
      return res.json({ message: "Si el correo existe, te enviamos un enlace para restablecer tu contraseña" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // En producción enviarías un correo, pero en dev mostramos el link directo
    const resetLink = `http://localhost:5173/reset?token=${resetToken}`;

    res.json({
      message: "Si el correo existe, te enviamos un enlace para restablecer tu contraseña",
      resetLink, // 👈 así lo puede usar el frontend
    });
  } catch (error) {
    console.error("❌ Error en /forgot-password:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==================== RESET PASSWORD ====================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const email = decoded.email;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error en /reset-password:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
