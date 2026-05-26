import api from '../utils/api'

export const obtenerDashboardService = async (diasLog) => {
  const params = {}
  if (diasLog) params.diasLog = diasLog
  const response = await api.get('/dashboard', { params })
  return response.data
}
