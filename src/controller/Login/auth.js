const pool = require('../../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario y contraseña son obligatorios',
      });
    }

    const sql = `
      SELECT 
        usuario_id,
        nombre_usuario,
        apellido_usuario,
        usuario,
        password,
        email,
        estado,
        rol_id,
        fecha_creado,
        usuario_creador
      FROM usuarios
      WHERE usuario = ?
      and estado = 1
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas',
      });
    }

    const usuarioDB = rows[0];

    const passwordValida = await bcrypt.compare(password, usuarioDB.password);

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      {
        usuario_id: usuarioDB.usuario_id,
        usuario: usuarioDB.usuario,
        email: usuarioDB.email,
        rol_id: usuarioDB.rol_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      ok: true,
      message: 'Login exitoso',
      token,
      usuario: {
        usuario_id: usuarioDB.usuario_id,
        nombre_usuario: usuarioDB.nombre_usuario,
        apellido_usuario: usuarioDB.apellido_usuario,
        usuario: usuarioDB.usuario,
        email: usuarioDB.email,
        rol_id: usuarioDB.rol_id,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = {
  login,
};