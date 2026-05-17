import api from '../utils/api'

export const obtenerPrendas = async () => {
  const response = await api.get('/prendas/obtener')
  return response.data
}

export const obtenerMedidasPorCliente = async (clienteId) => {
  const response = await api.get(`/prendas/${clienteId}/obtener`)
  return response.data
}

export const crearPrendas = async (prendaData) => {
  const response = await api.post('/prendas/crear', prendaData)
  return response.data
}

export const updatePrendas = async (id, prendaData) => {
  const response = await api.put(`/prendas/editar/${id}`, prendaData)
  return response.data
}

export const obtenerPrendaPorId = async (id) => {
  const response = await api.get(`/prendas/obtener/${id}`)
  return response.data
}

export const subirImagenesPrendaService = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("imagenes", file);
  });

  const response = await api.post("/prendas/imagen", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

