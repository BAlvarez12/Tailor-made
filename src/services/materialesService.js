import api from '../utils/api';

export const obtenerMaterialesActivosService = async () => {
  const response = await api.get("/materiales/activos");
  return response.data;
};