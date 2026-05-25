const esCorreoValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

const validarReglasPassword = (password) => {
  const valor = String(password || '');
  if (valor.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!/[a-z]/.test(valor)) {
    return 'La contraseña debe incluir al menos una letra minúscula.';
  }
  if (!/[A-Z]/.test(valor)) {
    return 'La contraseña debe incluir al menos una letra mayúscula.';
  }
  if (!/\d/.test(valor)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  if (!/[^A-Za-z0-9]/.test(valor)) {
    return 'La contraseña debe incluir al menos un símbolo.';
  }
  return null;
};

module.exports = {
  esCorreoValido,
  validarReglasPassword,
};
