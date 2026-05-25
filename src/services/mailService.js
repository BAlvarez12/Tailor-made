const nodemailer = require('nodemailer');

const crearTransporte = () => {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT) || 587;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error('Configuración de correo incompleta en .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const enviarCorreoRecuperacion = async ({ email, codigo, minutosValidez = 5 }) => {
  const transport = crearTransporte();
  const fromName = process.env.MAIL_FROM_NAME || 'Tailor';
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #111827;">Recuperación de contraseña</h2>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Tailor-Made.</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111827;">${codigo}</p>
      <p>Este código es válido por <strong>${minutosValidez} minutos</strong> y solo puede usarse una vez.</p>
      <p style="color: #64748b; font-size: 14px;">Si no solicitaste este cambio, ignora este correo.</p>
    </div>
  `;

  await transport.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: `${fromName} - Código de recuperación de contraseña`,
    html,
    text: `Tu código de recuperación es: ${codigo}. Válido por ${minutosValidez} minutos. Uso único.`,
  });
};

const enviarCorreoInvitacion = async ({
  email,
  nombreCompleto,
  usuarioLogin,
  enlaceActivacion,
  horasValidez = 72,
}) => {
  const transport = crearTransporte();
  const fromName = process.env.MAIL_FROM_NAME || 'Tailor';
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #111827;">Invitación a ${fromName}</h2>
      <p>Hola${nombreCompleto ? ` <strong>${nombreCompleto}</strong>` : ''},</p>
      <p>Te invitaron a unirte a la plataforma Tailor-Made. Tu usuario de acceso será:</p>
      <p style="font-size: 18px; font-weight: bold; color: #111827;">${usuarioLogin}</p>
      <p>Haz clic en el botón para crear tu contraseña y activar tu cuenta:</p>
      <p style="text-align: center; margin: 28px 0;">
        <a href="${enlaceActivacion}"
           style="display: inline-block; padding: 14px 24px; background: #111827; color: #fff;
                  text-decoration: none; border-radius: 10px; font-weight: bold;">
          Activar mi cuenta
        </a>
      </p>
      <p style="font-size: 13px; color: #64748b;">Este enlace es válido por ${horasValidez} horas.</p>
      <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">${enlaceActivacion}</p>
    </div>
  `;

  await transport.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: `${fromName} - Invitación a la plataforma`,
    html,
    text: `Fuiste invitado a ${fromName}. Usuario: ${usuarioLogin}. Activa tu cuenta: ${enlaceActivacion} (válido ${horasValidez} horas).`,
  });
};

module.exports = {
  enviarCorreoRecuperacion,
  enviarCorreoInvitacion,
  crearTransporte,
};
