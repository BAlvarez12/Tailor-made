import api from '../utils/api'

export const listarPermisosService = async () => {
  const response = await api.get('/permisos')
  return response.data
}
