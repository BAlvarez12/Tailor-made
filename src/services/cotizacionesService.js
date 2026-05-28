import api from "../utils/api";
import {
  abrirWhatsAppConMensaje,
  construirMensajeCotizacionWhatsApp,
  descargarArchivo,
} from "../utils/whatsapp";
import { entregarPdf } from "../utils/pdfDownloader";

export const crearCotizacionService = async (data) => {
  const response = await api.post("/cotizaciones", data);
  return response.data;
};

export const editarCotizacionService = async (id, data) => {
  const response = await api.put(`/cotizaciones/${id}`, data);
  return response.data;
};

export const anularCotizacionService = async (id, motivo = "") => {
  const response = await api.put(`/cotizaciones/${id}/anular`, { motivo });
  return response.data;
};

export const listarCotizacionesService = async (q = "", estado = "activas") => {
  const params = {};
  if (q) params.q = q;
  if (estado && estado !== "activas") params.estado = estado;
  const response = await api.get("/cotizaciones", { params });
  return response.data;
};

export const obtenerCotizacionPorIdService = async (id) => {
  const response = await api.get(`/cotizaciones/${id}`);
  return response.data;
};

export const obtenerPdfCotizacionBlob = async (id, codigo = "cotizacion") => {
  const response = await api.get(`/cotizaciones/${id}/pdf`, {
    responseType: "blob",
  });

  const nombreArchivo = `${codigo || "cotizacion"}.pdf`;
  const blob = new Blob([response.data], { type: "application/pdf" });

  return { blob, nombreArchivo };
};

export const abrirPdfCotizacion = async (id, codigo = "cotizacion") => {
  const { blob, nombreArchivo } = await obtenerPdfCotizacionBlob(id, codigo);
  await entregarPdf(blob, nombreArchivo);
};

const formatearMonedaWhatsApp = (valor) => {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "";
  return `Q ${numero.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const enviarCotizacionPorWhatsApp = async (cotizacion) => {
  const telefono = String(cotizacion?.cliente_telefono || "").trim();
  if (!telefono) {
    throw new Error("El cliente no tiene un número de teléfono registrado.");
  }

  if (!cotizacion?.cotizacion_id) {
    throw new Error("No se encontró la cotización para enviar.");
  }

  const detalle = await obtenerCotizacionPorIdService(cotizacion.cotizacion_id);

  const cotizacionMensaje = {
    ...detalle,
    cliente_telefono: telefono,
    cliente_nombre:
      cotizacion.cliente_nombre || detalle.cliente_nombre || "cliente",
    tipo_prenda_nombre:
      cotizacion.tipo_prenda_nombre || detalle.tipo_prenda_nombre || "",
    titulo_prenda: detalle.titulo_prenda || cotizacion.titulo_prenda || "",
    valor_total_formateado: formatearMonedaWhatsApp(
      detalle.valor_total ?? cotizacion.valor_total
    ),
  };

  const mensaje = construirMensajeCotizacionWhatsApp(cotizacionMensaje);
  abrirWhatsAppConMensaje(telefono, mensaje);

  return { modo: "texto" };
};
