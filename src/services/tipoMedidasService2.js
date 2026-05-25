import api from '../utils/api'

export const getTiposMedida = async () => {
  const res = await api.get('/tipo_medidas2')
  return res.data
}
