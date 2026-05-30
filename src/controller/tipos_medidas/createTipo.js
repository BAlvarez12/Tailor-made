const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const createTipo = async (req, res) => {
  try {
    const { nombre_tipo_medida, descripcion_tipo_medida } = req.body

    const usuario_creador = req.user?.usuario_id
    if (!usuario_creador) {
      return res.status(401).json({ error: 'No autorizado.' })
    }

    const nombre = String(nombre_tipo_medida || '').trim()
    const descripcion = descripcion_tipo_medida
      ? String(descripcion_tipo_medida).trim()
      : null

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del tipo de medida es obligatorio.' })
    }

    if (nombre.length > 50) {
      return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres.' })
    }

    if (descripcion && descripcion.length > 255) {
      return res.status(400).json({ error: 'La descripción no puede exceder 255 caracteres.' })
    }

    const [existe] = await db.query(
      'SELECT COUNT(*) AS total FROM tipo_medidas WHERE nombre_tipo_medida = ?',
      [nombre]
    )

    if (existe[0].total > 0) {
      return res.status(400).json({ error: 'El tipo ya existe' })
    }

    await db.query(
      `INSERT INTO tipo_medidas
         (nombre_tipo_medida, descripcion_tipo_medida, fecha_creado, usuario_creador, estado)
       VALUES (?, ?, NOW(), ?, 1)`,
      [nombre, descripcion, usuario_creador]
    )

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'tipo_medida',
      descripcion: `Tipo de medida "${nombre}" creado`,
      datosDespues: { nombre_tipo_medida: nombre, descripcion_tipo_medida: descripcion },
    })

    res.json({ message: 'Tipo creado' })

  } catch (error) {
    console.error(error)

    if (error.sqlMessage) {
      return res.status(400).json({ error: error.sqlMessage })
    }

    res.status(500).json({ error: 'Error al crear tipo' })
  }
}

module.exports = createTipo
