const pool = require('../../config/db.js')
const { ESTADO_USUARIO } = require('../../utils/estadosUsuario')
const {
  crearYEnviarCodigo,
  MINUTOS_VALIDEZ,
} = require('../../services/passwordResetService')

/**
 * Reinicio de contraseña iniciado por un admin desde el listado de usuarios.
 * - Solo aplica a usuarios en estado Activo con correo registrado.
 * - Genera un código de un solo uso (mismo flujo que "Olvidé mi contraseña")
 *   y lo envía al correo del usuario.
 * - El usuario debe completar el reset desde la pantalla de login.
 */
const reiniciarPasswordUsuario = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ message: 'El id del usuario es obligatorio.' })
    }

    const [rows] = await pool.query(
      `SELECT usuario_id, usuario, email, estado
         FROM usuarios
        WHERE usuario_id = ?
        LIMIT 1`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'El usuario no existe.' })
    }

    const usuarioDB = rows[0]

    if (Number(usuarioDB.estado) !== ESTADO_USUARIO.ACTIVO) {
      return res.status(400).json({
        message:
          'Solo puedes reiniciar la contraseña de usuarios activos. Para invitaciones pendientes usa «Reenviar invitación».',
      })
    }

    const email = String(usuarioDB.email || '').trim()

    if (!email) {
      return res.status(400).json({
        message:
          'El usuario no tiene correo registrado. Edítalo y agrega un correo antes de reiniciar la contraseña.',
      })
    }

    const resultado = await crearYEnviarCodigo(usuarioDB)

    if (!resultado?.enviado) {
      return res.status(500).json({
        message:
          'No se pudo enviar el correo de reinicio. Verifica la configuración de correo.',
      })
    }

    return res.status(200).json({
      message: `Correo de reinicio enviado a ${email}. El código es válido por ${MINUTOS_VALIDEZ} minutos.`,
      correoEnviado: true,
      minutosValidez: MINUTOS_VALIDEZ,
    })
  } catch (error) {
    console.error('Error al reiniciar contraseña:', error)

    if (error?.message?.includes('Configuración de correo')) {
      return res.status(500).json({
        message:
          'El servicio de correo no está configurado. Contacta al administrador.',
      })
    }

    return res.status(500).json({
      message: 'Error interno al reiniciar la contraseña.',
    })
  }
}

module.exports = { reiniciarPasswordUsuario }
