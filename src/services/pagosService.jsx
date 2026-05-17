import api from "../utils/api";

export const listarPlanesPagoService = async (params = {}) => {
  const response = await api.get("/pagos/planes", { params });
  return response.data;
};

export const obtenerPlanPagoService = async (id) => {
  const response = await api.get(`/pagos/planes/${id}`);
  return response.data;
};

export const listarCotizacionesClientePagoService = async (clienteId) => {
  const response = await api.get(`/pagos/cotizaciones-cliente/${clienteId}`);
  return response.data;
};

export const crearPlanPagoService = async (data) => {
  const response = await api.post("/pagos/planes", data);
  return response.data;
};

export const registrarPagoService = async (data) => {
  const response = await api.post("/pagos/registrar", data);
  return response.data;
};

export const abrirPdfRecibo = async (pagoId, codigo = "recibo") => {
  const response = await api.get(`/pagos/recibo/${pagoId}/pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const ventana = window.open(url, "_blank");

  if (!ventana) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${codigo}.pdf`;
    link.click();
  }

  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};
