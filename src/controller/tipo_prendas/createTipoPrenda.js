const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const createTipoPrenda = async (req, res) => {
  try {
    const { nombre } = req.body
    const nombreLimpio = String(nombre || '').trim()

    if (!nombreLimpio) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' })
    }

    if (nombreLimpio.length > 50) {
      return res.status(400).json({ message: 'El nombre no puede exceder 50 caracteres.' })
    }

    const [existentes] = await db.query(
      'SELECT tipo_prendas_id FROM tipo_prendas WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
      [nombreLimpio]
    )

    if (existentes.length > 0) {
      return res.status(409).json({ message: 'Ya existe un tipo de prenda con ese nombre.' })
    }

    const [result] = await db.query(
      'INSERT INTO tipo_prendas (nombre, estado) VALUES (?, 1)',
      [nombreLimpio]
    )

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'tipo_prenda',
      entidadId: result.insertId,
      descripcion: `Tipo de prenda "${nombreLimpio}" creado`,
      datosDespues: { nombre: nombreLimpio },
    })

    return res.status(201).json({
      message: 'Tipo de prenda creado',
      tipo_prendas_id: result.insertId,
    })
  } catch (error) {
    console.error('Error en createTipoPrenda:', error)
    return res.status(500).json({ message: 'Error al crear el tipo de prenda' })
  }
}

module.exports = createTipoPrenda
