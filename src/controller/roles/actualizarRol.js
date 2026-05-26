const pool = require('../../config/db.js')
const { invalidarTodo } = require('../../services/permisosCache')
const { registrar, fromReq } = require('../../services/logOperaciones')

const actualizarRol = async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const { id } = req.params
    const { nombre_rol, permiso_ids } = req.body

    const nombre = (nombre_rol || '').trim()
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del rol es obligatorio.' })
    }

    await connection.beginTransaction()

    const [updateResult] = await connection.query(
      'UPDATE roles SET nombre_rol = ? WHERE rol_id = ?',
      [nombre, id]
    )

    if (updateResult.affectedRows === 0) {
      await connection.rollback()
      return res.status(404).json({ message: 'Rol no encontrado' })
    }

    // Reemplazar la lista completa de permisos del rol
    await connection.query('DELETE FROM permisos_rol WHERE rol_id = ?', [id])

    if (Array.isArray(permiso_ids) && permiso_ids.length > 0) {
      const values = permiso_ids.map((pid) => [Number(pid), Number(id)])
      await connection.query(
        'INSERT INTO permisos_rol (permiso_id, rol_id) VALUES ?',
        [values]
      )
    }

    await connection.commit()

    // Invalida el cache de permisos: cualquier usuario con este rol
    // recibirá los permisos actualizados en su próxima request.
    invalidarTodo()

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'rol',
      entidadId: Number(id),
      descripcion: `Rol "${nombre}" editado (${Array.isArray(permiso_ids) ? permiso_ids.length : 0} permisos)`,
      datosDespues: { nombre_rol: nombre, permiso_ids: permiso_ids || [] },
    })

    res.json({ message: 'Rol actualizado correctamente' })
  } catch (error) {
    await connection.rollback()
    console.error('Error al actualizar rol:', error)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un rol con ese nombre.' })
    }
    res.status(500).json({ message: 'Error al actualizar rol' })
  } finally {
    connection.release()
  }
}

module.exports = { actualizarRol }
