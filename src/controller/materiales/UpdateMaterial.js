const fs = require('fs')
const path = require('path')
const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const MAX_IMAGENES_POR_MATERIAL = 3
const UPLOAD_DIR_MATERIALES = path.join(__dirname, '../../../uploads/materiales')

// Parser tolerante: la lista de imágenes a eliminar viene como JSON string
// dentro de form-data. Si viene mal o vacía, retornamos array vacío.
const parsearListaEliminar = (raw) => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string' && s.length > 0) : []
  } catch {
    return []
  }
}

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params

    const {
      nombre_material,
      descripcion_material,
      categoria_id,
      precio_unitario,
      referencia_compra,
      stock
    } = req.body

    const nombreLimpio = (nombre_material || '').trim()
    const imagenesAEliminar = parsearListaEliminar(req.body.imagenes_eliminar)

    if (!nombreLimpio || !categoria_id) {
      return res.status(400).json({
        message: 'Nombre y categoría son obligatorios.'
      })
    }

    // Validar el límite total de imágenes ANTES de tocar nada (evita
    // dejar archivos huérfanos en /uploads si pasamos el tope).
    // Cuenta: ya guardadas - las que se van a eliminar + las nuevas.
    if (req.files && req.files.length > 0) {
      const [existRows] = await db.query(
        `SELECT COUNT(*) AS total FROM materiales_img WHERE material_id = ?`,
        [id]
      )
      const yaTiene = Number(existRows[0]?.total ?? 0)
      const totalFinal = yaTiene - imagenesAEliminar.length + req.files.length

      if (totalFinal > MAX_IMAGENES_POR_MATERIAL) {
        return res.status(400).json({
          message: `Máximo ${MAX_IMAGENES_POR_MATERIAL} imágenes por material.`,
        })
      }
    }

    await db.query(
      `UPDATE materiales SET
          nombre_material = ?,
          descripcion_material = ?,
          categoria_id = ?,
          precio_unitario = ?,
          referencia_compra = ?,
          stock = ?
        WHERE material_id = ?`,
      [
        nombre_material,
        descripcion_material,
        categoria_id,
        precio_unitario,
        referencia_compra,
        stock,
        id
      ]
    )

    // Eliminar imágenes existentes que el usuario marcó. Validamos que
    // realmente pertenezcan a este material antes de borrarlas (seguridad:
    // un atacante no debería poder borrar imágenes de otro material).
    let imagenesEliminadasFinal = 0
    if (imagenesAEliminar.length > 0) {
      const [validRows] = await db.query(
        `SELECT url_img FROM materiales_img WHERE material_id = ? AND url_img IN (?)`,
        [id, imagenesAEliminar]
      )
      const validos = validRows.map((r) => r.url_img)

      if (validos.length > 0) {
        await db.query(
          `DELETE FROM materiales_img WHERE material_id = ? AND url_img IN (?)`,
          [id, validos]
        )
        // Borrar archivos físicos. Ignoramos errores individuales (archivo
        // ya no existe, permisos, etc.) — la fila de BD ya se borró que
        // es lo importante para la lógica de negocio.
        for (const filename of validos) {
          const filepath = path.join(UPLOAD_DIR_MATERIALES, filename)
          fs.unlink(filepath, () => {})
        }
        imagenesEliminadasFinal = validos.length
      }
    }

    // Guardar las imágenes nuevas (si las hay) en la tabla materiales_img
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => [id, file.filename])
      await db.query(
        `INSERT INTO materiales_img (material_id, url_img) VALUES ?`,
        [images]
      )
    }

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'material',
      entidadId: Number(id),
      descripcion: `Material "${nombreLimpio}" editado`,
      datosDespues: {
        nombre_material: nombreLimpio,
        categoria_id,
        precio_unitario,
        imagenes_agregadas: req.files?.length || 0,
        imagenes_eliminadas: imagenesEliminadasFinal,
      },
    })

    res.json({ message: 'Material actualizado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar material' })
  }
}

module.exports = { updateMaterial }
