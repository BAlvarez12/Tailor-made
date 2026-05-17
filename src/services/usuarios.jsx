import api from '../utils/api';

export const obtenerUsuariosService = async () => {
  const response = await api.get('/usuarios/obtener')
  return response.data
}

export const crearUsuarioService = async (userData) => {
  const response = await api.post('/usuarios/crear', userData)
  return response.data
}

export const actualizarUsuarioService = async (usuarioId, userData) => {
  const response = await api.put(`/usuarios/actualizar/${usuarioId}`, userData);
  return response.data;
};

export const obtenerUsuarioPorId = async (usuarioId) => {
  const response = await api.get(`/usuarios/obtener/${usuarioId}`);
  return response.data;
};