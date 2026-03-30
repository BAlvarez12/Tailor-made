/* CONFIGURACIÓN DB */
const db = require('../../config/db')

/* OBTENER TIPOS */
exports.getTipos = async (req, res) => {
  try {
    const { archivados } = req.query

    let query = 'SELECT * FROM tipo_medidas'

    /* FILTRO POR ESTADO */
    if (archivados === 'true') {
      query += ' WHERE estado = 0'
    } else {
      query += ' WHERE estado = 1'
    }

    const [rows] = await db.query(query)
    res.json(rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener tipos' })
  }
}

/* CREAR TIPO */
exports.createTipo = async (req, res) => {
  try {
    const { 
      nombre_tipo_medida, 
      descripcion_tipo_medida, 
      usuario_creador 
    } = req.body

    /* VALIDAR NOMBRE */
    if (!nombre_tipo_medida) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    /* VALIDAR USUARIO */
    if (!usuario_creador) {
      return res.status(400).json({ error: 'Usuario requerido' })
    }

    /* VALIDAR DUPLICADOS */
    const [exist] = await db.query(
      'SELECT * FROM tipo_medidas WHERE nombre_tipo_medida = ?',
      [nombre_tipo_medida]
    )

    if (exist.length > 0) {
      return res.status(400).json({ error: 'El tipo ya existe' })
    }

    /* INSERTAR TIPO */
    await db.query(
      `INSERT INTO tipo_medidas 
      (nombre_tipo_medida, descripcion_tipo_medida, fecha_creado, usuario_creador, estado) 
      VALUES (?, ?, NOW(), ?, 1)`,
      [nombre_tipo_medida, descripcion_tipo_medida, usuario_creador]
    )

    res.json({ message: 'Tipo creado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear tipo' })
  }
}

/* ACTUALIZAR TIPO */
exports.updateTipo = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_tipo_medida, descripcion_tipo_medida } = req.body

    await db.query(
      `UPDATE tipo_medidas 
       SET nombre_tipo_medida = ?, descripcion_tipo_medida = ?
       WHERE tipo_medida_id = ?`,
      [nombre_tipo_medida, descripcion_tipo_medida, id]
    )

    res.json({ message: 'Actualizado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar' })
  }
}

/* ARCHIVAR TIPO */
exports.archiveTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE tipo_medidas SET estado = 0 WHERE tipo_medida_id = ?',
      [id]
    )

    res.json({ message: 'Archivado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al archivar' })
  }
}

/* DESARCHIVAR TIPO */
exports.restoreTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE tipo_medidas SET estado = 1 WHERE tipo_medida_id = ?',
      [id]
    )

    res.json({ message: 'Restaurado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al restaurar' })
  }
}