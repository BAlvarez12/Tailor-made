const db = require('../../config/db')

const obtenerPrendaPorId = async (req, res) => {
  try {
    const { id } = req.params
    const prendaId = Number(id)

    if (!prendaId || Number.isNaN(prendaId)) {
      return res.status(400).json({
        message: 'El id de la prenda no es válido'
      })
    }

    const [prendaRows] = await db.query(
      `
        SELECT
          cp.cliente_prenda_id,
          cp.cliente_id,
          cp.tipo_prenda_id,
          cp.titulo,
          cp.estado,
          cp.fecha_creado,
          cp.usuario_creador,

          c.nombre_cliente,
          c.apellido_cliente,
          c.telefono,

          tp.nombre AS nombre_tipo_prenda

        FROM cliente_prenda cp
        LEFT JOIN clientes c
          ON cp.cliente_id = c.cliente_id
        LEFT JOIN tipo_prendas tp
          ON cp.tipo_prenda_id = tp.tipo_prendas_id
        WHERE cp.cliente_prenda_id = ?
        LIMIT 1
      `,
      [prendaId]
    )

    if (prendaRows.length === 0) {
      return res.status(404).json({
        message: 'Prenda no encontrada'
      })
    }

    const prenda = prendaRows[0]

    const [imagenesRows] = await db.query(
      `
        SELECT
          cliente_prenda_id,
          url_img
        FROM cliente_prenda_img
        WHERE cliente_prenda_id = ?
      `,
      [prendaId]
    )

    const [medidasRows] = await db.query(
      `
        SELECT
          cpm.cliente_medida_id,
          cpm.cliente_prenda_id,
          cpm.tipo_medida_id,
          cpm.valor,
          cpm.fecha_creado,
          cpm.usuario_creado,

          tm.nombre_tipo_medida,
          tm.descripcion_tipo_medida
          
        FROM cliente_prenda_medidas cpm
        LEFT JOIN tipo_medidas tm
          ON cpm.tipo_medida_id = tm.tipo_medida_id
        WHERE cpm.cliente_prenda_id = ?
        ORDER BY cpm.cliente_medida_id ASC
      `,
      [prendaId]
    )

    const [materialesRows] = await db.query(
      `
        SELECT
          cpmat.cliente_p_material_id,
          cpmat.cliente_prenda_id,
          cpmat.material_id,
          cpmat.cantidad,
          cpmat.observaciones,
          cpmat.fecha_creado,
          cpmat.usuario,

          m.nombre_material,
          m.descripcion_material,
          m.precio_unitario,
          m.referencia_compra,
          m.stock,
          m.categoria_id,

          cm.nombre_categoria

        FROM cliente_prenda_material cpmat
        LEFT JOIN materiales m
          ON cpmat.material_id = m.material_id
        LEFT JOIN categorias_material cm
          ON m.categoria_id = cm.categoria_id
        WHERE cpmat.cliente_prenda_id = ?
        ORDER BY cpmat.cliente_p_material_id ASC
      `,
      [prendaId]
    )

    return res.status(200).json({
      ...prenda,
      imagenes: imagenesRows,
      medidas: medidasRows,
      materiales: materialesRows
    })
  } catch (error) {
    console.error('Error en obtenerPrendaPorId:', error)
    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

module.exports = obtenerPrendaPorId