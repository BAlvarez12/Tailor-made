import api from '../utils/api'

export const getUnidades = async (archivados = false) => {
  return api.get(`/unidades?archivados=${archivados}`)
}

export const createUnidad = async (data) => {
  return api.post('/unidades', data)
}

export const updateUnidad = async (id, data) => {
  return api.put(`/unidades/${id}`, data)
}

export const archiveUnidad = async (id) => {
  return api.put(`/unidades/archivar/${id}`)
}

export const restoreUnidad = async (id) => {
  return api.put(`/unidades/restaurar/${id}`)
}

export const obtenerUnidadesMedidaService = async () => {
  const response = await api.get('/unidadesv2/activas')
  return response.data
}
