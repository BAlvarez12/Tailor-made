const db = require('../../config/db')

const obtenerPrendas = async (req, res) => {
  try {
    const sql = `
      SELECT
        cp.cliente_prenda_id,
        cp.titulo,
        cp.estado,
        cp.fecha_creado,

        c.cliente_id,
        c.nombre_cliente,
        c.apellido_cliente,
        c.telefono,

        tp.tipo_prendas_id,
        tp.nombre AS tipo_prenda_nombre,

        cpi.url_img

      FROM cliente_prenda cp
      INNER JOIN clientes c
        ON cp.cliente_id = c.cliente_id
      LEFT JOIN tipo_prendas tp
        ON cp.tipo_prenda_id = tp.tipo_prendas_id
      LEFT JOIN cliente_prenda_img cpi
        ON cp.cliente_prenda_id = cpi.cliente_prenda_id

      WHERE cp.estado = 1
        AND c.estado = 1

      ORDER BY cp.cliente_prenda_id DESC
    `

    const [rows] = await db.query(sql)

    const prendasMap = new Map()

    for (const row of rows) {
      if (!prendasMap.has(row.cliente_prenda_id)) {
        prendasMap.set(row.cliente_prenda_id, {
          cliente_prenda_id: row.cliente_prenda_id,
          titulo: row.titulo,
          estado: row.estado,
          fecha_creado: row.fecha_creado,

          cliente: {
            cliente_id: row.cliente_id,
            nombre_cliente: row.nombre_cliente,
            apellido_cliente: row.apellido_cliente,
            nombre_completo: `${row.nombre_cliente || ''} ${row.apellido_cliente || ''}`.trim(),
            telefono: row.telefono
          },

          tipo_prenda: {
            tipo_prendas_id: row.tipo_prendas_id,
            nombre: row.tipo_prenda_nombre
          },

          imagen_principal: null,
          imagenes: []
        })
      }

      const prenda = prendasMap.get(row.cliente_prenda_id)

      if (row.url_img && !prenda.imagenes.includes(row.url_img)) {
        prenda.imagenes.push(row.url_img)

        if (!prenda.imagen_principal) {
          prenda.imagen_principal = row.url_img
        }
      }
    }

    const prendas = Array.from(prendasMap.values())

    return res.status(200).json(prendas)
  } catch (error) {
    console.error('Error en obtenerPrendas:', error)
    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

module.exports = { obtenerPrendas }