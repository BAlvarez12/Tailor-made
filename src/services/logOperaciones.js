const pool = require('../config/db')

/**
 * Registra una entrada en la tabla de auditoría `log_operaciones`.
 *
 * Es "fire-and-forget": NO se hace await del INSERT.  Si el log falla,
 * solo se imprime el error en consola y la operación principal del
 * controlador no se ve afectada.
 *
 * Helper de uso:
 *   const { registrar, fromReq } = require('../../services/logOperaciones')
 *
 *   registrar({
 *     ...fromReq(req),
 *     accion: 'crear',
 *     entidad: 'cliente',
 *     entidadId: cliente_id,
 *     descripcion: `Cliente ${nombre} ${apellido} creado`,
 *     datosDespues: { nombre, apellido, dpi },
 *   })
 */
const registrar = ({
  usuarioId = null,
  accion,
  entidad,
  entidadId = null,
  descripcion = null,
  datosAntes = null,
  datosDespues = null,
  ip = null,
  userAgent = null,
}) => {
  pool
    .query(
      `INSERT INTO log_operaciones
        (usuario_id, accion, entidad, entidad_id, descripcion, datos_antes, datos_despues, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        accion,
        entidad,
        entidadId,
        descripcion ? String(descripcion).slice(0, 255) : null,
        datosAntes ? JSON.stringify(datosAntes) : null,
        datosDespues ? JSON.stringify(datosDespues) : null,
        ip ? String(ip).slice(0, 45) : null,
        userAgent ? String(userAgent).slice(0, 255) : null,
      ]
    )
    .catch((error) => {
      console.error('[logOperaciones] no se pudo registrar:', error.message)
    })
}

/**
 * Extrae los campos del request relevantes para el log (usuario, IP, UA).
 * Se usa así: `registrar({ ...fromReq(req), accion: ..., entidad: ... })`
 */
const fromReq = (req) => ({
  usuarioId: req?.user?.usuario_id || null,
  ip: req?.ip || req?.headers?.['x-forwarded-for'] || null,
  userAgent: req?.headers?.['user-agent'] || null,
})

module.exports = { registrar, fromReq }
