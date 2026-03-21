import api from '../../utils/api'

export const obtenerUsuariosService = async () => {
  const response = await api.get('/usuarios/obtener')
  return response.data
}

export const crearUsuarioService = async (userData) => {
  const response = await api.post('/usuarios/crear', userData)
  return response.data
}
