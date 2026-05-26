const CODIGO_PAIS_GT = "502";

export const normalizarTelefonoWhatsApp = (telefono) => {
  let digitos = String(telefono || "").replace(/\D/g, "");
  if (!digitos) return "";

  if (digitos.startsWith("00")) {
    digitos = digitos.slice(2);
  }

  if (digitos.length === 8) {
    digitos = `${CODIGO_PAIS_GT}${digitos}`;
  } else if (digitos.length === 9 && digitos.startsWith("0")) {
    digitos = `${CODIGO_PAIS_GT}${digitos.slice(1)}`;
  }

  return digitos;
};

const formatearFechaCotizacion = (fecha) => {
  if (!fecha) return "";
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const agregarSeccionMedidas = (lineas, medidas = []) => {
  if (!medidas.length) return;

  lineas.push("", "*Medidas:*");
  medidas.forEach((medida) => {
    const nombre = medida.nombre_tipo_medida || "Medida";
    const valor = medida.valor ?? "—";
    const unidad = medida.unidad_label ? ` ${medida.unidad_label}` : "";
    lineas.push(`• ${nombre}: ${valor}${unidad}`);
  });
};

const agregarSeccionMateriales = (lineas, materiales = []) => {
  if (!materiales.length) return;

  lineas.push("", "*Materiales:*");
  materiales.forEach((material) => {
    const nombre = material.nombre_material || "Material";
    const cantidad = material.cantidad != null ? ` (x${material.cantidad})` : "";
    const observacion = material.observaciones
      ? ` — ${material.observaciones}`
      : "";
    lineas.push(`• ${nombre}${cantidad}${observacion}`);
  });
};

export const construirMensajeCotizacionWhatsApp = (cotizacion) => {
  const nombre = (cotizacion?.cliente_nombre || "cliente").trim();
  const codigo = cotizacion?.codigo_cotizacion || "cotización";
  const total = cotizacion?.valor_total_formateado || "";
  const tipoPrenda = cotizacion?.tipo_prenda_nombre || "";
  const tituloPrenda = cotizacion?.titulo_prenda || "";
  const notas = String(cotizacion?.notas || "").trim();
  const fecha = formatearFechaCotizacion(cotizacion?.fecha_creado);

  const lineas = [
    `Hola ${nombre}, le compartimos su cotización de *BeautyBell*:`,
    "",
    `*Código:* ${codigo}`,
  ];

  if (fecha) lineas.push(`*Fecha:* ${fecha}`);

  lineas.push("", "*Detalle de la prenda*");

  if (tipoPrenda) lineas.push(`• Tipo: ${tipoPrenda}`);
  if (tituloPrenda) lineas.push(`• Referencia: ${tituloPrenda}`);
  if (!tipoPrenda && !tituloPrenda) {
    lineas.push("• Sin descripción adicional");
  }

  agregarSeccionMedidas(lineas, cotizacion?.medidas || []);
  agregarSeccionMateriales(lineas, cotizacion?.materiales || []);

  if (total) lineas.push("", `*Total:* ${total}`);
  if (notas) lineas.push("", `*Notas:* ${notas}`);

  lineas.push(
    "",
    "*Esta cotización está sujeta a cambios* según ajustes de diseño, materiales o medidas.",
    "",
    "Quedamos atentos a cualquier consulta. ¡Gracias por su preferencia!"
  );

  return lineas.join("\n");
};

const formatearMontoQ = (valor) => {
  const n = Number(valor);
  if (!Number.isFinite(n)) return "";
  return `Q ${n.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const etiquetaTipoPagoTexto = (tipo) => {
  const t = String(tipo || "").toLowerCase();
  if (t === "anticipo") return "Anticipo";
  if (t === "abono") return "Abono";
  if (t === "otro") return "Otro";
  return tipo ? String(tipo) : "Pago";
};

/**
 * Construye el mensaje de WhatsApp para un pago/recibo.
 *
 * Espera:
 *   pago: { codigo_recibo, monto, fecha_pago, tipo_pago, numero_transferencia, notas }
 *   plan: { codigo_plan, cliente_nombre, valor_a_cobrar, total_abonado, saldo_pendiente }
 *   contexto: { numeroPago, totalPagos } (opcional, para "Abono X de Y")
 */
export const construirMensajePagoWhatsApp = ({ pago, plan, contexto = {} }) => {
  const nombre = String(plan?.cliente_nombre || "cliente").trim();
  const recibo = pago?.codigo_recibo || "—";
  const fecha = formatearFechaCotizacion(pago?.fecha_pago);
  const monto = formatearMontoQ(pago?.monto);
  const tipoTxt = etiquetaTipoPagoTexto(pago?.tipo_pago);
  const cuotaInfo =
    contexto?.numeroPago && contexto?.totalPagos
      ? ` (${contexto.numeroPago} de ${contexto.totalPagos})`
      : "";

  const lineas = [
    `Hola ${nombre}, le confirmamos su pago a *BeautyBell*:`,
    "",
    `*Recibo:* ${recibo}`,
  ];

  if (fecha) lineas.push(`*Fecha:* ${fecha}`);
  if (monto) lineas.push(`*Monto:* ${monto}`);
  lineas.push(`*Tipo:* ${tipoTxt}${cuotaInfo}`);

  if (pago?.numero_transferencia) {
    lineas.push(`*Transferencia:* ${pago.numero_transferencia}`);
  }

  if (plan) {
    lineas.push("", "*Estado del plan*");
    if (plan.codigo_plan) lineas.push(`• Plan: ${plan.codigo_plan}`);
    if (plan.valor_a_cobrar != null)
      lineas.push(`• Total a cobrar: ${formatearMontoQ(plan.valor_a_cobrar)}`);
    if (plan.total_abonado != null)
      lineas.push(`• Abonado a la fecha: ${formatearMontoQ(plan.total_abonado)}`);
    if (plan.saldo_pendiente != null)
      lineas.push(`• Saldo pendiente: ${formatearMontoQ(plan.saldo_pendiente)}`);
  }

  const saldoCero = Number(plan?.saldo_pendiente) <= 0;
  if (saldoCero) {
    lineas.push("", "✅ *Pago completado.* ¡Gracias por su preferencia!");
  } else {
    lineas.push("", "¡Gracias por su pago! Quedamos atentos a cualquier consulta.");
  }

  if (pago?.notas && String(pago.notas).trim()) {
    lineas.push("", `*Notas:* ${String(pago.notas).trim()}`);
  }

  return lineas.join("\n");
};

export const abrirWhatsAppConMensaje = (telefono, mensaje) => {
  const numero = normalizarTelefonoWhatsApp(telefono);
  if (!numero) {
    throw new Error("El número de teléfono no es válido para WhatsApp.");
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const descargarArchivo = (blob, nombreArchivo) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};
