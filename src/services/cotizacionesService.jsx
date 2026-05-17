import api from "../utils/api";

export const crearCotizacionService = async (data) => {
  const response = await api.post("/cotizaciones", data);
  return response.data;
};

export const listarCotizacionesService = async (q = "") => {
  const response = await api.get("/cotizaciones", {
    params: q ? { q } : {},
  });
  return response.data;
};

export const obtenerCotizacionPorIdService = async (id) => {
  const response = await api.get(`/cotizaciones/${id}`);
  return response.data;
};

export const abrirPdfCotizacion = async (id, codigo = "cotizacion") => {
  const response = await api.get(`/cotizaciones/${id}/pdf`, {
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
