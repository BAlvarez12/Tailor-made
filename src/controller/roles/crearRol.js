const pool = require('../../config/db.js')
const { registrar, fromReq } = require('../../services/logOperaciones')

const crearRol = async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const { nombre_rol, permiso_ids } = req.body
    const usuario_creador = req.user?.usuario_id

    if (!usuario_creador) {
      return res.status(401).json({ message: 'No autorizado.' })
    }

    const nombre = (nombre_rol || '').trim()
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del rol es obligatorio.' })
    }

    await connection.beginTransaction()

    const [result] = await connection.query(
      'INSERT INTO roles (nombre_rol, usuario_creador, fecha_creado) VALUES (?, ?, NOW())',
      [nombre, usuario_creador]
    )

    const rol_id = result.insertId

    if (Array.isArray(permiso_ids) && permiso_ids.length > 0) {
      const values = permiso_ids.map((pid) => [Number(pid), rol_id])
      await connection.query(
        'INSERT INTO permisos_rol (permiso_id, rol_id) VALUES ?',
        [values]
      )
    }

    await connection.commit()

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'rol',
      entidadId: rol_id,
      descripcion: `Rol "${nombre}" creado con ${Array.isArray(permiso_ids) ? permiso_ids.length : 0} permisos`,
      datosDespues: { nombre_rol: nombre, permiso_ids: permiso_ids || [] },
    })

    res.json({ message: 'Rol creado correctamente', rol_id })
  } catch (error) {
    await connection.rollback()
    console.error('Error al crear rol:', error)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un rol con ese nombre.' })
    }
    res.status(500).json({ message: 'Error al crear rol' })
  } finally {
    connection.release()
  }
}

module.exports = { crearRol }
