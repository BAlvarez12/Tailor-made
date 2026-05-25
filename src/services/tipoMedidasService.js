import api from '../utils/api'

export const getTipos = (archivados = false) =>
  api.get(`/tipo-medidas?archivados=${archivados}`)

export const createTipo = (data) => api.post('/tipo-medidas', data)

export const updateTipo = (id, data) => api.put(`/tipo-medidas/${id}`, data)

export const archiveTipo = (id) => api.put(`/tipo-medidas/archivar/${id}`)

export const restoreTipo = (id) => api.put(`/tipo-medidas/restaurar/${id}`)

export const obtenerTiposMedidaPorPrenda = async (prendaId) => {
  const response = await api.get(`/tipo-medidas/obtener/${prendaId}/medidas`)
  return response.data
}
