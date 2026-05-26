import api from '../utils/api'

export const busquedaGlobalService = async (q) => {
  const response = await api.get('/busqueda', { params: { q } })
  return response.data
}
