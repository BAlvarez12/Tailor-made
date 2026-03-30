/* CONFIGURACIÓN ROUTER */
const express = require('express')
const router = express.Router()
const db = require('../config/db')

/* OBTENER UNIDADES */
router.get('/', async (req, res) => {
  try {
    const { archivados } = req.query

    let query = 'SELECT * FROM unidades_medida'

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
    res.status(500).json(error)
  }
})

/* CREAR UNIDAD */
router.post('/', async (req, res) => {
  try {
    const { nombre_unidad, simbolo_unidad } = req.body

    /* VALIDAR CAMPOS */
    if (!nombre_unidad || !simbolo_unidad) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })
    }

    /* VALIDAR DUPLICADOS */
    const [exist] = await db.query(
      'SELECT * FROM unidades_medida WHERE nombre_unidad = ? OR simbolo_unidad = ?',
      [nombre_unidad, simbolo_unidad]
    )

    if (exist.length > 0) {
      return res.status(400).json({
        error: 'La unidad ya existe'
      })
    }

    /* INSERTAR UNIDAD */
    await db.query(
      'INSERT INTO unidades_medida (nombre_unidad, simbolo_unidad, estado) VALUES (?, ?, 1)',
      [nombre_unidad, simbolo_unidad]
    )

    res.json({ message: 'Unidad creada correctamente' })

  } catch (error) {
    console.error("ERROR AL CREAR:", error)
    res.status(500).json({
      error: 'Error interno del servidor'
    })
  }
})

/* ACTUALIZAR UNIDAD */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_unidad, simbolo_unidad } = req.body

    /* VALIDAR CAMPOS */
    if (!nombre_unidad || !simbolo_unidad) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })
    }

    await db.query(
      'UPDATE unidades_medida SET nombre_unidad = ?, simbolo_unidad = ? WHERE unidad_id = ?',
      [nombre_unidad, simbolo_unidad, id]
    )

    res.json({ message: 'Unidad actualizada' })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al actualizar'
    })
  }
})

/* ARCHIVAR UNIDAD */
router.put('/archivar/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE unidades_medida SET estado = 0 WHERE unidad_id = ?',
      [id]
    )

    res.json({ message: 'Unidad archivada' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al archivar'
    })
  }
})

/* DESARCHIVAR UNIDAD */
router.put('/restaurar/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE unidades_medida SET estado = 1 WHERE unidad_id = ?',
      [id]
    )

    res.json({ message: 'Unidad restaurada' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al restaurar'
    })
  }
})

module.exports = router