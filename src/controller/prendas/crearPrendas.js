const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const crearPrendas = async (req, res) => {
  let connection

  try {
    const {
      cliente_id,
      tipo_prenda_id,
      titulo,
      imagenes = [],
      medidas = [],
      materiales = []
    } = req.body

    const usuarioCreador = req.user?.usuario_id
    if (!usuarioCreador) {
      return res.status(401).json({ message: 'No autorizado.' })
    }

    if (!cliente_id || !tipo_prenda_id || !titulo) {
      return res.status(400).json({
        message: 'cliente_id, tipo_prenda_id y titulo son obligatorios'
      })
    }

    const clienteId = Number(cliente_id)
    const tipoPrendaId = Number(tipo_prenda_id)
    const tituloLimpio = String(titulo).trim()

    if (!clienteId || !tipoPrendaId || !tituloLimpio) {
      return res.status(400).json({
        message: 'Los datos principales son inválidos'
      })
    }

    const imagenesValidas = Array.isArray(imagenes)
      ? imagenes
          .filter((img) => typeof img === 'string' && img.trim() !== '')
          .map((img) => img.trim())
          .slice(0, 3)
      : []

    const medidasValidas = Array.isArray(medidas)
      ? medidas
          .filter(
            (medida) =>
              medida &&
              medida.tipo_medida_id &&
              medida.valor !== undefined &&
              medida.valor !== null &&
              medida.valor !== ''
          )
          .map((medida) => ({
            tipo_medida_id: Number(medida.tipo_medida_id),
            valor: Number(medida.valor)
          }))
          .filter(
            (medida) =>
              medida.tipo_medida_id > 0 &&
              !Number.isNaN(medida.valor)
          )
      : []

    const materialesValidos = Array.isArray(materiales)
      ? materiales
          .filter(
            (material) =>
              material &&
              material.material_id &&
              material.cantidad !== undefined &&
              material.cantidad !== null &&
              material.cantidad !== ''
          )
          .map((material) => ({
            material_id: Number(material.material_id),
            cantidad: Number(material.cantidad),
            observaciones: material.observacion
              ? String(material.observacion).trim()
              : ''
          }))
          .filter(
            (material) =>
              material.material_id > 0 &&
              !Number.isNaN(material.cantidad) &&
              material.cantidad > 0
          )
      : []

    connection = await db.getConnection()
    await connection.beginTransaction()

    const sqlClientePrenda = `
      INSERT INTO cliente_prenda (
        cliente_id,
        tipo_prenda_id,
        titulo,
        estado,
        fecha_creado,
        usuario_creador
      ) VALUES (?, ?, ?, ?, NOW(), ?)
    `

    const [resultClientePrenda] = await connection.query(sqlClientePrenda, [
      clienteId,
      tipoPrendaId,
      tituloLimpio,
      1,
      usuarioCreador
    ])

    const cliente_prenda_id = resultClientePrenda.insertId

    if (imagenesValidas.length > 0) {
      const sqlImagenes = `
        INSERT INTO cliente_prenda_img (
          cliente_prenda_id,
          url_img
        ) VALUES ?
      `

      const valuesImagenes = imagenesValidas.map((url) => [
        cliente_prenda_id,
        url
      ])

      await connection.query(sqlImagenes, [valuesImagenes])
    }

    if (medidasValidas.length > 0) {
      const sqlMedidas = `
        INSERT INTO cliente_prenda_medidas (
          cliente_prenda_id,
          tipo_medida_id,
          valor,
          fecha_creado,
          usuario_creado
        ) VALUES ?
      `

      const valuesMedidas = medidasValidas.map((medida) => [
        cliente_prenda_id,
        medida.tipo_medida_id,
        medida.valor,
        new Date(),
        usuarioCreador
      ])

      await connection.query(sqlMedidas, [valuesMedidas])
    }

    if (materialesValidos.length > 0) {
      const sqlMateriales = `
        INSERT INTO cliente_prenda_material (
          cliente_prenda_id,
          material_id,
          cantidad,
          observaciones,
          fecha_creado,
          usuario
        ) VALUES ?
      `

      const valuesMateriales = materialesValidos.map((material) => [
        cliente_prenda_id,
        material.material_id,
        material.cantidad,
        material.observaciones,
        new Date(),
        String(usuarioCreador)
      ])

      await connection.query(sqlMateriales, [valuesMateriales])
    }

    await connection.commit()

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'prenda',
      entidadId: cliente_prenda_id,
      descripcion: `Prenda "${tituloLimpio}" creada para cliente #${clienteId}`,
      datosDespues: {
        cliente_id: clienteId,
        tipo_prenda_id: tipoPrendaId,
        titulo: tituloLimpio,
        medidas: medidasValidas.length,
        materiales: materialesValidos.length,
        imagenes: imagenesValidas.length,
      },
    })

    return res.status(201).json({
      message: 'Prenda creada correctamente',
      cliente_prenda_id
    })
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }

    console.error('Error en crearPrendas:', error)

    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

module.exports = crearPrendas