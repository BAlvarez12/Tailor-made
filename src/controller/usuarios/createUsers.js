const bcrypt = require('bcryptjs')
const pool = require('../../config/db.js');


const crearUsuario = async (req, res) => {
  try {
    const {
      nombre_usuario,
      apellido_usuario,
      usuario,
      password,
      email,
      estado,
      rol_id,
    } = req.body

    if (!nombre_usuario || !nombre_usuario.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' })
    }

    if (!apellido_usuario || !apellido_usuario.trim()) {
      return res.status(400).json({ message: 'El apellido es obligatorio.' })
    }

    if (!usuario || !usuario.trim()) {
      return res.status(400).json({ message: 'El usuario es obligatorio.' })
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: 'La contraseña es obligatoria.' })
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'El correo es obligatorio.' })
    }

    if (rol_id === undefined || rol_id === null || rol_id === '') {
      return res.status(400).json({ message: 'El rol es obligatorio.' })
    }

    const [usuarioExistente] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE usuario = ? LIMIT 1',
      [usuario.trim()]
    )

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' })
    }

    const [emailExistente] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE email = ? LIMIT 1',
      [email.trim()]
    )

    if (emailExistente.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO usuarios (
        nombre_usuario,
        apellido_usuario,
        usuario,
        password,
        email,
        estado,
        rol_id,
        fecha_creado,
        usuario_creador
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `

    const values = [
      nombre_usuario.trim(),
      apellido_usuario.trim(),
      usuario.trim(),
      passwordHash,
      email.trim(),
      Number(estado ?? 1),
      Number(rol_id),
      1,
    ]

    const [result] = await pool.query(sql, values)

    return res.status(201).json({
      message: 'Usuario creado correctamente.',
      usuario_id: result.insertId,
    })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return res.status(500).json({
      message: 'Error interno del servidor al crear el usuario.',
    })
  }
}

module.exports = {
  crearUsuario,
}