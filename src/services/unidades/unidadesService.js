/* CONFIGURACIÓN API */
import axios from "axios";

const API_URL = "http://localhost:3000/api/unidades";

/* OBTENER UNIDADES */
export const getUnidades = async (archivados = false) => {
  return await axios.get(`${API_URL}?archivados=${archivados}`);
};

/* CREAR UNIDAD */
export const createUnidad = async (data) => {
  return await axios.post(API_URL, data);
};

/* ACTUALIZAR UNIDAD */
export const updateUnidad = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

/* ARCHIVAR UNIDAD */
export const archiveUnidad = async (id) => {
  return await axios.put(`${API_URL}/archivar/${id}`);
};

/* DESARCHIVAR UNIDAD */
export const restoreUnidad = async (id) => {
  return await axios.put(`${API_URL}/restaurar/${id}`);
};