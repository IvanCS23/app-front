import { api } from './api';

// Obtener todos los clientes
export const getClients = async () => {
  const res = await api.get('/clients');
  return res.data;
};

// Crear cliente
export const createClient = async (data) => {
  const res = await api.post('/clients', data);
  return res.data;
};