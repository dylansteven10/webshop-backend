const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configuración de multer
const upload = multer({ dest: "uploads/" });

// Aquí irían tus funciones de controlador, idealmente importadas de otro archivo
// Para este ejemplo, las incluiremos directamente para mostrar el flujo
router.post("/upload-photo/:id", upload.single("foto"), async (req, res) => {
  const { id } = req.params;
  const foto = req.file.filename;

  // db debe ser importado o accesible aquí
  // const db = require('../tu-ruta-a-la-db');
  
  try {
    await db.query("UPDATE usuarios SET foto=? WHERE id=?", [foto, id]);
    const [updated] = await db.query("SELECT * FROM usuarios WHERE id=?", [id]);
    
    // Si usas sesiones, esta línea es válida
    // req.session.user = updated[0];

    res.json({ message: "Foto actualizada", user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la foto" });
  }
});

module.exports = router;