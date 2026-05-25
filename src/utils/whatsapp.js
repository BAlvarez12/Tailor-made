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
