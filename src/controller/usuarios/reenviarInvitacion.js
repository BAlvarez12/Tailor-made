const pool = require('../../config/db.js');
const { ESTADO_USUARIO } = require('../../utils/estadosUsuario');
const { crearTokenInvitacion } = require('../../services/invitacionUsuarioService');

const reenviarInvitacionUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio.' });
    }

    const [rows] = await pool.query(
      `SELECT usuario_id, usuario, nombre_usuario, apellido_usuario, email, estado
       FROM usuarios
       WHERE usuario_id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    const usuarioDB = rows[0];

    if (Number(usuarioDB.estado) !== ESTADO_USUARIO.INVITACION_ENVIADA) {
      return res.status(400).json({
        message:
          'Solo puedes reenviar la invitación a usuarios con estado «Invitación enviada».',
      });
    }

    const email = String(usuarioDB.email || '').trim();

    if (!email) {
      return res.status(400).json({
        message: 'El usuario no tiene correo registrado. Agrega un correo antes de reenviar.',
      });
    }

    const invitacion = await crearTokenInvitacion({
      usuario_id: usuarioDB.usuario_id,
      usuario: usuarioDB.usuario,
      nombre_usuario: usuarioDB.nombre_usuario,
      apellido_usuario: usuarioDB.apellido_usuario,
      email,
    });

    if (!invitacion.enviado) {
      return res.status(500).json({
        message: 'No se pudo enviar el correo de invitación. Verifica la configuración de correo.',
      });
    }

    return res.status(200).json({
      message: `Invitación reenviada a ${email}.`,
      invitacionEnviada: true,
      usuario: usuarioDB.usuario,
      estado: ESTADO_USUARIO.INVITACION_ENVIADA,
    });
  } catch (error) {
    console.error('Error al reenviar invitación:', error);
    return res.status(500).json({
      message: 'Error interno al reenviar la invitación.',
    });
  }
};

module.exports = { reenviarInvitacionUsuario };
