import api from '../utils/api'

export const obtenerTiposPrendaActivosService = async () => {
  const response = await api.get("/tipo-prendas/tipos/activos");
  return response.data;
};

export const getTipoPrendas = async (archivados = false) => {
  return api.get(`/tipo-prendas?archivados=${archivados}`);
};

export const createTipoPrenda = async (data) => {
  return api.post('/tipo-prendas', data);
};

export const updateTipoPrenda = async (id, data) => {
  return api.put(`/tipo-prendas/${id}`, data);
};

export const archiveTipoPrenda = async (id) => {
  return api.put(`/tipo-prendas/archivar/${id}`);
};

export const restoreTipoPrenda = async (id) => {
  return api.put(`/tipo-prendas/restaurar/${id}`);
};
