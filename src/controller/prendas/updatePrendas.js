const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const normalizarImagenes = (imagenes) => {
  if (!Array.isArray(imagenes)) return null

  return imagenes
    .filter((img) => typeof img === 'string' && img.trim() !== '')
    .map((img) => img.trim())
    .slice(0, 3)
}

const normalizarMedidas = (medidas) => {
  if (!Array.isArray(medidas)) return null

  return medidas
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
}

const normalizarMateriales = (materiales) => {
  if (!Array.isArray(materiales)) return null

  return materiales
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
}

const updatePrendas = async (req, res) => {
  let connection

  try {
    const { id } = req.params
    const {
      cliente_id,
      tipo_prenda_id,
      titulo,
      imagenes,
      medidas,
      materiales
    } = req.body

    const usuarioCreador = req.user?.usuario_id
    if (!usuarioCreador) {
      return res.status(401).json({ message: 'No autorizado.' })
    }

    const clientePrendaId = Number(id)
    const clienteId = Number(cliente_id)
    const tipoPrendaId = Number(tipo_prenda_id)
    const tituloLimpio = String(titulo || '').trim()

    if (!clientePrendaId) {
      return res.status(400).json({
        message: 'El id de la prenda es inválido'
      })
    }

    if (!clienteId || !tipoPrendaId || !tituloLimpio) {
      return res.status(400).json({
        message: 'cliente_id, tipo_prenda_id y titulo son obligatorios'
      })
    }

    const imagenesValidas = normalizarImagenes(imagenes)
    const medidasValidas = normalizarMedidas(medidas)
    const materialesValidos = normalizarMateriales(materiales)

    connection = await db.getConnection()
    await connection.beginTransaction()

    const [prendaExistente] = await connection.query(
      `
        SELECT cliente_prenda_id
        FROM cliente_prenda
        WHERE cliente_prenda_id = ?
          AND estado = 1
        LIMIT 1
      `,
      [clientePrendaId]
    )

    if (prendaExistente.length === 0) {
      await connection.rollback()
      return res.status(404).json({
        message: 'La prenda no existe o no está activa'
      })
    }

    await connection.query(
      `
        UPDATE cliente_prenda
        SET
          cliente_id = ?,
          tipo_prenda_id = ?,
          titulo = ?
        WHERE cliente_prenda_id = ?
      `,
      [clienteId, tipoPrendaId, tituloLimpio, clientePrendaId]
    )

    if (imagenesValidas !== null) {
      await connection.query(
        `
          DELETE FROM cliente_prenda_img
          WHERE cliente_prenda_id = ?
        `,
        [clientePrendaId]
      )

      if (imagenesValidas.length > 0) {
        const valuesImagenes = imagenesValidas.map((url) => [
          clientePrendaId,
          url
        ])

        await connection.query(
          `
            INSERT INTO cliente_prenda_img (
              cliente_prenda_id,
              url_img
            ) VALUES ?
          `,
          [valuesImagenes]
        )
      }
    }

    if (medidasValidas !== null) {
      await connection.query(
        `
          DELETE FROM cliente_prenda_medidas
          WHERE cliente_prenda_id = ?
        `,
        [clientePrendaId]
      )

      if (medidasValidas.length > 0) {
        const valuesMedidas = medidasValidas.map((medida) => [
          clientePrendaId,
          medida.tipo_medida_id,
          medida.valor,
          new Date(),
          usuarioCreador
        ])

        await connection.query(
          `
            INSERT INTO cliente_prenda_medidas (
              cliente_prenda_id,
              tipo_medida_id,
              valor,
              fecha_creado,
              usuario_creado
            ) VALUES ?
          `,
          [valuesMedidas]
        )
      }
    }

    if (materialesValidos !== null) {
      await connection.query(
        `
          DELETE FROM cliente_prenda_material
          WHERE cliente_prenda_id = ?
        `,
        [clientePrendaId]
      )

      if (materialesValidos.length > 0) {
        const valuesMateriales = materialesValidos.map((material) => [
          clientePrendaId,
          material.material_id,
          material.cantidad,
          material.observaciones,
          new Date(),
          String(usuarioCreador)
        ])

        await connection.query(
          `
            INSERT INTO cliente_prenda_material (
              cliente_prenda_id,
              material_id,
              cantidad,
              observaciones,
              fecha_creado,
              usuario
            ) VALUES ?
          `,
          [valuesMateriales]
        )
      }
    }

    await connection.commit()

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'prenda',
      entidadId: clientePrendaId,
      descripcion: `Prenda "${tituloLimpio}" (#${clientePrendaId}) editada`,
      datosDespues: {
        cliente_id: clienteId,
        tipo_prenda_id: tipoPrendaId,
        titulo: tituloLimpio,
      },
    })

    return res.status(200).json({
      message: 'Prenda actualizada correctamente',
      cliente_prenda_id: clientePrendaId
    })
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }

    console.error('Error en updatePrendas:', error)

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

module.exports = { updatePrendas }