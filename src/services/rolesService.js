import api from '../utils/api'

export const obtenerRolesService = async () => {
  const response = await api.get('/roles/obtener')
  return response.data
}

export const obtenerRolPorIdService = async (id) => {
  const response = await api.get(`/roles/${id}`)
  return response.data
}

export const crearRolService = async (data) => {
  const response = await api.post('/roles', data)
  return response.data
}

export const actualizarRolService = async (id, data) => {
  const response = await api.put(`/roles/${id}`, data)
  return response.data
}
