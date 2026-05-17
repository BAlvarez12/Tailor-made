const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre_usuario,
      apellido_usuario,
      usuario,
      password,
      email,
      estado,
      rol_id,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio.' });
    }

    if (!nombre_usuario || !nombre_usuario.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    if (!usuario || !usuario.trim()) {
      return res.status(400).json({ message: 'El usuario es obligatorio.' });
    }

    if (rol_id === undefined || rol_id === null || rol_id === '') {
      return res.status(400).json({ message: 'El rol es obligatorio.' });
    }

    const nombreLimpio = nombre_usuario.trim();
    const apellidoLimpio = apellido_usuario ? apellido_usuario.trim() : null;
    const usuarioLimpio = usuario.trim();
    const emailLimpio = email && email.trim() ? email.trim() : null;

    const [usuarioActual] = await pool.query(
      'SELECT usuario_id, password FROM usuarios WHERE usuario_id = ? LIMIT 1',
      [id]
    );

    if (usuarioActual.length === 0) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    const [usuarioExistente] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE usuario = ? AND usuario_id <> ? LIMIT 1',
      [usuarioLimpio, id]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    if (emailLimpio) {
      const [emailExistente] = await pool.query(
        'SELECT usuario_id FROM usuarios WHERE email = ? AND usuario_id <> ? LIMIT 1',
        [emailLimpio, id]
      );

      if (emailExistente.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
      }
    }

    let passwordHash = usuarioActual[0].password;

    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const sql = `
      UPDATE usuarios
      SET
        nombre_usuario = ?,
        apellido_usuario = ?,
        usuario = ?,
        password = ?,
        email = ?,
        estado = ?,
        rol_id = ?
      WHERE usuario_id = ?
    `;

    const values = [
      nombreLimpio,
      apellidoLimpio,
      usuarioLimpio,
      passwordHash,
      emailLimpio,
      Number(estado ?? 1),
      Number(rol_id),
      Number(id),
    ];

    await pool.query(sql, values);

    return res.status(200).json({
      message: 'Usuario actualizado correctamente.',
      usuario_id: Number(id),
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({
      message: 'Error interno del servidor al actualizar el usuario.',
    });
  }
};

module.exports = { actualizarUsuario };