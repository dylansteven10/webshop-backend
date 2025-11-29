// controllers/userController.js
import pool from "../db.js";

// 📝 Actualizar datos del perfil
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, celular } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE users SET nombre=?, apellido=?, email=?, celular=? WHERE id=?",
      [nombre, apellido, email, celular, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const [updated] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    res.status(200).json({ message: "Perfil actualizado", user: updated[0] });
  } catch (err) {
    console.error("❌ Error en updateProfile:", err);
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

// 📸 Subir foto de perfil
export const uploadProfilePhoto = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }

  // Guardamos la ruta relativa para servirla en http://localhost:5000/uploads/
  const fotoPath = `/uploads/${req.file.filename}`;

  try {
    const [result] = await pool.query("UPDATE users SET foto=? WHERE id=?", [
      fotoPath,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const [updated] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    res.status(200).json({
      message: "Foto actualizada",
      user: updated[0],
    });
  } catch (err) {
    console.error("❌ Error en uploadProfilePhoto:", err);
    res.status(500).json({ error: "Error al actualizar la foto" });
  }
};
