// authController.js (backend)
exports.login = async (req, res) => {
  const { correo, password } = req.body;
  const [rows] = await db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND password = ?",
    [correo, password]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Guardar usuario en sesión
  req.session.user = rows[0];

  res.json({ message: "Login exitoso", user: rows[0] });
};
