const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const createMaterial = async (req, res) => {
  try {
    const {
      categoria_id,
      nombre_material,
      descripcion_material,
      precio_unitario,
      referencia_compra,
      stock
    } = req.body

    const nombreLimpio = (nombre_material || '').trim()
    const stockTxt = String(stock ?? '').trim()
    const stockNum = stockTxt === '' ? null : Number(stockTxt)

    if (!nombreLimpio || !categoria_id || stockNum === null) {
      return res.status(400).json({
        message: 'Nombre, categoría y cantidad inicial son obligatorios.'
      })
    }

    if (Number.isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        message: 'La cantidad inicial debe ser un número mayor o igual a 0.'
      })
    }

    const usuario_creador = req.user.usuario_id

    const [rows] = await db.query(
  `CALL sp_create_material(?, ?, ?, ?, ?, ?, ?)`,
  [
    categoria_id,
    nombre_material,
    descripcion_material,
    precio_unitario,
    referencia_compra,
    stock,
    usuario_creador
  ]
)

const material_id = rows[0][0].material_id

    // IMÁGENES
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => [material_id, file.filename])

      await db.query(`
        INSERT INTO materiales_img (material_id, url_img)
        VALUES ?
      `, [images])
    }

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'material',
      entidadId: material_id,
      descripcion: `Material "${nombreLimpio}" creado`,
      datosDespues: {
        nombre_material: nombreLimpio,
        categoria_id,
        precio_unitario,
        stock: stockNum,
        imagenes: req.files?.length || 0,
      },
    })

    res.json({ message: 'Material creado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear material' })
  }
}

module.exports = { createMaterial }