import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

export const getMenu = (slug) => api.get(`/menu/${slug}`);
export const crearPedido = (data) => api.post("/pedidos", data);
export const getPedidos = () => api.get("/pedidos");
export const getDetallePedido = (id) => api.get(`/pedidos/${id}/detalle`);
export const actualizarEstado = (id, estado) => api.put(`/pedidos/${id}`, { estado });
