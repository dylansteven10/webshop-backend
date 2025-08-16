import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  // ... tu configuración de base de datos
});

export const uploadProfilePhoto = async (req, res) => {
  const { id } = req.params;
  const foto = req.file.filename;

  try {
    await db.query("UPDATE usuarios SET foto=? WHERE id=?", [foto, id]);
    const [updated] = await db.query("SELECT * FROM usuarios WHERE id=?", [id]);
    res.json({ message: "Foto actualizada", user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la foto" });
  }
};