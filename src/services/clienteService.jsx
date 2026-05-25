import api from '../utils/api'

export const getClientes = async () => {
  const response = await api.get('/clientes')
  return response.data
}

export const createCliente = async (data) => {
  const response = await api.post('/clientes', data)
  return response.data
}

export const updateCliente = async (id, data) => {
  const response = await api.put(`/clientes/${id}`, data)
  return response.data
}

export const obtenerClientesActivosService = async () => {
  const response = await api.get('/clientes/activos')
  return response.data
}
