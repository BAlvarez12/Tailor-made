import api from '../utils/api'

export const loginService = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

const bodyIdentificador = (identificador) => ({
  identificador: String(identificador || '').trim(),
})

export const solicitarRecuperacionService = async (identificador) => {
  const response = await api.post(
    '/auth/olvide-contrasena/solicitar',
    bodyIdentificador(identificador)
  )
  return response.data
}

export const reenviarRecuperacionService = async (identificador) => {
  const response = await api.post(
    '/auth/olvide-contrasena/reenviar',
    bodyIdentificador(identificador)
  )
  return response.data
}

export const verificarCodigoRecuperacionService = async (identificador, codigo) => {
  const response = await api.post('/auth/olvide-contrasena/verificar-codigo', {
    ...bodyIdentificador(identificador),
    codigo,
  })
  return response.data
}

export const restablecerPasswordService = async (data) => {
  const response = await api.post('/auth/olvide-contrasena/restablecer', {
    identificador: data.identificador ?? data.usuario,
    usuario: data.usuario,
    codigo: data.codigo,
    tokenId: data.tokenId,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  })
  return response.data
}

export const activarCuentaService = async (data) => {
  const response = await api.post('/auth/activar-cuenta', {
    usuario: data.usuario,
    tokenId: data.tokenId,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  })
  return response.data
}

export const evaluarFortalezaPassword = (password) => {
  const valor = String(password || '')

  const reglas = {
    minimo8: valor.length >= 8,
    minuscula: /[a-z]/.test(valor),
    mayuscula: /[A-Z]/.test(valor),
    numero: /\d/.test(valor),
    simbolo: /[^A-Za-z0-9]/.test(valor),
  }

  const cumplidas = Object.values(reglas).filter(Boolean).length

  let nivel = 'debil'
  let etiqueta = 'Débil'

  if (cumplidas === 5 && valor.length >= 12) {
    nivel = 'alta'
    etiqueta = 'Alta'
  } else if (cumplidas >= 4) {
    nivel = 'media'
    etiqueta = 'Media'
  }

  const valida =
    reglas.minimo8 &&
    reglas.minuscula &&
    reglas.mayuscula &&
    reglas.numero &&
    reglas.simbolo

  return { reglas, nivel, etiqueta, cumplidas, valida }
}

export const validarPasswordRecuperacion = (password) => {
  const { valida, reglas } = evaluarFortalezaPassword(password)

  if (!reglas.minimo8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (!reglas.minuscula) {
    return 'Debe incluir al menos una letra minúscula.'
  }
  if (!reglas.mayuscula) {
    return 'Debe incluir al menos una letra mayúscula.'
  }
  if (!reglas.numero) {
    return 'Debe incluir al menos un número.'
  }
  if (!reglas.simbolo) {
    return 'Debe incluir al menos un símbolo.'
  }

  if (!valida) {
    return 'La contraseña no cumple los requisitos de seguridad.'
  }

  return null
}
