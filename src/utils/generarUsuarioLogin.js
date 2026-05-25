const pool = require('../config/db');

const MAX_LONGITUD_USUARIO = 45;

const normalizarTexto = (texto) =>
  String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizarPalabra = (texto) =>
  normalizarTexto(texto).replace(/[^a-z]/g, '');

const extraerPalabras = (texto) =>
  normalizarTexto(texto)
    .split(/\s+/)
    .map(normalizarPalabra)
    .filter(Boolean);

/**
 * Separa nombre y apellido aunque el usuario escriba el nombre completo en un solo campo.
 */
const parsearNombreCompleto = (nombreInput, apellidoInput) => {
  let palabrasNombre = extraerPalabras(nombreInput);
  let palabrasApellido = extraerPalabras(apellidoInput);

  if (palabrasApellido.length === 0 && palabrasNombre.length >= 2) {
    palabrasApellido = [palabrasNombre.pop()];
  }

  const nombreStr = palabrasNombre.join('');
  const apellidoStr = palabrasApellido.join('');

  return {
    palabrasNombre,
    palabrasApellido,
    nombreStr,
    apellidoStr,
  };
};

const generarCandidatosUsuario = (parsed) => {
  const { palabrasNombre, palabrasApellido, nombreStr, apellidoStr } = parsed;
  const candidatos = [];

  const agregar = (valor) => {
    const limpio = String(valor || '').slice(0, MAX_LONGITUD_USUARIO);
    if (limpio && !candidatos.includes(limpio)) {
      candidatos.push(limpio);
    }
  };

  const n = nombreStr;
  const a = apellidoStr;

  if (!n && !a) return candidatos;
  if (!a) {
    agregar(n);
    return candidatos;
  }
  if (!n) {
    agregar(a);
    return candidatos;
  }

  // 1) Más letras del nombre + apellido completo (jperez, juperez, juanperez…)
  for (let i = 1; i <= n.length; i += 1) {
    agregar(n.slice(0, i) + a);
  }

  // 2) Varias palabras en nombre: iniciales o más letras del segundo nombre
  if (palabrasNombre.length >= 2) {
    const inicialesNombre = palabrasNombre.map((p) => p.charAt(0)).join('');

    for (let cantidad = 2; cantidad <= palabrasNombre.length; cantidad += 1) {
      const ini = palabrasNombre
        .slice(0, cantidad)
        .map((p) => p.charAt(0))
        .join('');
      agregar(ini + a);
    }

    agregar(inicialesNombre + a);

    const segunda = palabrasNombre[1];
    for (let i = 1; i <= segunda.length; i += 1) {
      agregar(palabrasNombre[0].charAt(0) + segunda.slice(0, i) + a);
    }

    for (let i = 1; i <= palabrasNombre[0].length; i += 1) {
      const restoIniciales = palabrasNombre
        .slice(1)
        .map((p) => p.charAt(0))
        .join('');
      agregar(palabrasNombre[0].slice(0, i) + restoIniciales + a);
    }

    for (let i = 0; i < palabrasNombre.length; i += 1) {
      for (let j = 1; j <= palabrasNombre[i].length; j += 1) {
        const prefijo = palabrasNombre
          .slice(0, i)
          .map((p) => p.charAt(0))
          .join('');
        agregar(prefijo + palabrasNombre[i].slice(0, j) + a);
      }
    }
  }

  // 3) Apellido compuesto: más letras de cada apellido
  if (palabrasApellido.length >= 2) {
    const inicialesApellido = palabrasApellido.map((p) => p.charAt(0)).join('');

    agregar(n.charAt(0) + inicialesApellido);
    agregar(inicialesApellido + n.charAt(0));

    for (let i = 1; i <= n.length; i += 1) {
      agregar(n.slice(0, i) + inicialesApellido);
    }

    for (let i = 1; i <= palabrasApellido[0].length; i += 1) {
      const sufijoIni = palabrasApellido
        .slice(1)
        .map((p) => p.charAt(0))
        .join('');
      agregar(n.charAt(0) + palabrasApellido[0].slice(0, i) + sufijoIni);
    }

    for (let i = 0; i < palabrasApellido.length; i += 1) {
      for (let j = 1; j <= palabrasApellido[i].length; j += 1) {
        const prefijoAp = palabrasApellido
          .slice(0, i)
          .map((p) => p.charAt(0))
          .join('');
        agregar(n.charAt(0) + prefijoAp + palabrasApellido[i].slice(0, j));
      }
    }
  }

  // 4) Nombre corto + más letras del apellido
  for (let j = 1; j <= a.length; j += 1) {
    agregar(n.charAt(0) + a.slice(0, j));
  }

  // 5) Combinaciones nombre + fragmentos de apellido
  agregar(n + a.charAt(0));
  for (let j = 2; j <= Math.min(a.length, 4); j += 1) {
    agregar(n.slice(0, Math.min(3, n.length)) + a.slice(0, j));
  }

  return candidatos;
};

const generarBaseUsuario = (nombre, apellido) => {
  const parsed = parsearNombreCompleto(nombre, apellido);
  const candidatos = generarCandidatosUsuario(parsed);
  return candidatos[0] || '';
};

const usuarioExiste = async (usuario, excluirId = null) => {
  const params = [usuario];
  let sql = 'SELECT usuario_id FROM usuarios WHERE usuario = ? LIMIT 1';

  if (excluirId) {
    sql = 'SELECT usuario_id FROM usuarios WHERE usuario = ? AND usuario_id <> ? LIMIT 1';
    params.push(excluirId);
  }

  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
};

const emailExiste = async (email, excluirId = null) => {
  const correo = String(email || '').trim().toLowerCase();
  if (!correo) return false;

  const params = [correo];
  let sql =
    'SELECT usuario_id FROM usuarios WHERE LOWER(TRIM(email)) = ? LIMIT 1';

  if (excluirId) {
    sql =
      'SELECT usuario_id FROM usuarios WHERE LOWER(TRIM(email)) = ? AND usuario_id <> ? LIMIT 1';
    params.push(excluirId);
  }

  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
};

const validarUsuarioYCorreoUnicos = async ({
  usuario,
  email = null,
  excluirId = null,
}) => {
  if (usuario && (await usuarioExiste(usuario, excluirId))) {
    return { ok: false, message: 'El nombre de usuario ya existe.' };
  }

  if (email && (await emailExiste(email, excluirId))) {
    return { ok: false, message: 'El correo ya está registrado.' };
  }

  return { ok: true };
};

const obtenerUsuarioLoginUnico = async (nombre, apellido, excluirId = null) => {
  const parsed = parsearNombreCompleto(nombre, apellido);
  const candidatos = generarCandidatosUsuario(parsed);

  if (candidatos.length === 0) {
    candidatos.push('usuario');
  }

  for (const candidato of candidatos) {
    if (!(await usuarioExiste(candidato, excluirId))) {
      return candidato;
    }
  }

  const base = candidatos[0];
  let contador = 2;

  while (contador < 1000) {
    const conNumero = `${base}${contador}`.slice(0, MAX_LONGITUD_USUARIO);
    if (!(await usuarioExiste(conNumero, excluirId))) {
      return conNumero;
    }
    contador += 1;
  }

  return `${base}${Date.now()}`.slice(0, MAX_LONGITUD_USUARIO);
};

module.exports = {
  parsearNombreCompleto,
  generarCandidatosUsuario,
  generarBaseUsuario,
  usuarioExiste,
  emailExiste,
  validarUsuarioYCorreoUnicos,
  obtenerUsuarioLoginUnico,
};
