const pool = require('../../config/db.js');

const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.usuario_id,
        t.nombre_usuario,
        t.apellido_usuario,
        t.usuario,
        t.email,
        t.estado,
        a.nombre_rol
      FROM usuarios t
      inner join roles a
      on t.rol_id = a.rol_id
      ORDER BY t.usuario_id DESC
    `)

    res.json(rows)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
}

module.exports = {
  obtenerUsuarios,

}