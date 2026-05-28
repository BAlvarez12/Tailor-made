import api from '../utils/api'

export const obtenerMiCuentaService = async () => {
  const response = await api.get('/usuarios/me')
  return response.data
}

export const actualizarMiPerfilService = async (datos) => {
  const response = await api.put('/usuarios/me/perfil', datos)
  return response.data
}

export const cambiarMiPasswordService = async (datos) => {
  const response = await api.put('/usuarios/me/password', datos)
  return response.data
}
