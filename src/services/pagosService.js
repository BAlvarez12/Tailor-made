import api from "../utils/api";
import {
  abrirWhatsAppConMensaje,
  construirMensajePagoWhatsApp,
} from "../utils/whatsapp";

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

/**
 * Abre WhatsApp Web/Mobile con el mensaje del recibo de pago.
 * Lanza si no hay teléfono. Solo texto (wa.me no permite adjuntos).
 */
export const enviarPagoPorWhatsApp = ({ pago, plan, contexto } = {}) => {
  const telefono = String(plan?.cliente_telefono || "").trim();
  if (!telefono) {
    throw new Error("El cliente no tiene un número de teléfono registrado.");
  }
  if (!pago?.pago_cliente_id) {
    throw new Error("No se encontró el pago para enviar.");
  }

  const mensaje = construirMensajePagoWhatsApp({ pago, plan, contexto });
  abrirWhatsAppConMensaje(telefono, mensaje);
  return { modo: "texto" };
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
