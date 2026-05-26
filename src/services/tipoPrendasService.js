import api from '../utils/api'

export const obtenerTiposPrendaActivosService = async () => {
  const response = await api.get("/tipo-prendas/tipos/activos");
  return response.data;
};