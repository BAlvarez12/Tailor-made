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

export const parsearNombreCompleto = (nombreInput, apellidoInput) => {
  let palabrasNombre = extraerPalabras(nombreInput);
  let palabrasApellido = extraerPalabras(apellidoInput);

  if (palabrasApellido.length === 0 && palabrasNombre.length >= 2) {
    palabrasApellido = [palabrasNombre.pop()];
  }

  return {
    palabrasNombre,
    palabrasApellido,
    nombreStr: palabrasNombre.join(''),
    apellidoStr: palabrasApellido.join(''),
  };
};

export const generarCandidatosUsuario = (parsed) => {
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

  for (let i = 1; i <= n.length; i += 1) {
    agregar(n.slice(0, i) + a);
  }

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

  for (let j = 1; j <= a.length; j += 1) {
    agregar(n.charAt(0) + a.slice(0, j));
  }

  agregar(n + a.charAt(0));
  for (let j = 2; j <= Math.min(a.length, 4); j += 1) {
    agregar(n.slice(0, Math.min(3, n.length)) + a.slice(0, j));
  }

  return candidatos;
};

export const generarVistaPreviaUsuario = (nombre, apellido) => {
  const parsed = parsearNombreCompleto(nombre, apellido);
  const candidatos = generarCandidatosUsuario(parsed);
  return candidatos[0] || '';
};

export const tieneApellidoDetectable = (nombre, apellido) => {
  const parsed = parsearNombreCompleto(nombre, apellido);
  return Boolean(parsed.apellidoStr);
};
