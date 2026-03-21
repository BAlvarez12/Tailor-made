/* CONFIGURACIÓN API */
import axios from "axios";

const API_URL = "http://localhost:3000/api/clientes";

/* OBTENER CLIENTES */
export const getClientes = async (archivados = false) => {
  try {
    let url = API_URL;

    if (archivados === true) {
      url += "?archivados=1";
    }

    console.log("URL:", url); // 👈 DEBUG

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en getClientes:", error);
    throw error;
  }
};

/* CREAR CLIENTE */
export const createCliente = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

/* ACTUALIZAR CLIENTE */
export const updateCliente = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

/* ARCHIVAR CLIENTE */
export const deleteCliente = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

/* DESARCHIVAR CLIENTE */
export const restoreCliente = async (id) => {
  const response = await axios.put(`${API_URL}/restore/${id}`);
  return response.data;
};