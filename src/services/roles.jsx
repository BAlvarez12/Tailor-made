import api from '../utils/api'

export const obtenerRolesService = async () => {
  const response = await api.get('/roles/obtener')
  return response.data
}
