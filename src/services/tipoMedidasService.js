/* CONFIGURACIÓN API */
import axios from "axios";
import api from '../utils/api';

const API_URL = "http://localhost:3000/api/tipo-medidas";

/* OBTENER TIPOS */
export const getTipos = (archivados = false) =>
  axios.get(`${API_URL}?archivados=${archivados}`);

/* CREAR TIPO */
export const createTipo = (data) =>
  axios.post(API_URL, data);

/* ACTUALIZAR TIPO */
export const updateTipo = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

/* ARCHIVAR TIPO */
export const archiveTipo = (id) =>
  axios.put(`${API_URL}/archivar/${id}`);

/* DESARCHIVAR TIPO */
export const restoreTipo = (id) =>
  axios.put(`${API_URL}/restaurar/${id}`);

export const obtenerTiposMedidaPorPrenda = async (prendaId) => {
  const response = await api.get(`/tipo-medidas/obtener/${prendaId}/medidas`)
  return response.data
}