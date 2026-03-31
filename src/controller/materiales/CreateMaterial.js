const db = require('../../config/db')

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

    const usuario_creador = req.user.usuario_id

    const [result] = await db.query(`
      INSERT INTO materiales 
      (categoria_id, nombre_material, descripcion_material, precio_unitario, referencia_compra, stock, usuario_creador)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      categoria_id,
      nombre_material,
      descripcion_material,
      precio_unitario,
      referencia_compra,
      stock,
      usuario_creador
    ])

    const material_id = result.insertId

    // IMÁGENES
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => [material_id, file.filename])

      await db.query(`
        INSERT INTO materiales_img (material_id, url_img)
        VALUES ?
      `, [images])
    }

    res.json({ message: 'Material creado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear material' })
  }
}

module.exports = { createMaterial }