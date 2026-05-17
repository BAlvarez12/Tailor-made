import axios from "axios";

const API_URL = "http://localhost:3000/api/clientes";

// 🔍 LEER
export const getClientes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ➕ CREAR
export const createCliente = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// ✏️ ACTUALIZAR
export const updateCliente = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

//obtener solo clientes activos
export const obtenerClientesActivosService = async () => {
  const response = await axios.get(`${API_URL}/activos`);
  return response.data;
};