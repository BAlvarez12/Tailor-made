const PDFDocument = require("pdfkit");
const { formatearMoneda } = require("./pdfCotizacion");

const MARGIN = 40;
const HEADER_H = 76;
const FOOTER_H = 40;
const GAP = 14;
const PAD = 12;

const COLORS = {
  rosa: "#ec4899",
  text: "#0f172a",
  textSoft: "#334155",
  muted: "#64748b",
  white: "#ffffff",
  border: "#e2e8f0",
  surface: "#f8fafc",
};

const contentWidth = (doc) => doc.page.width - MARGIN * 2;

const truncarTexto = (texto, max = 120) => {
  const s = String(texto || "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 3)}...`;
};

const etiquetaTipoPago = (tipo) => {
  const map = { anticipo: "Anticipo", abono: "Abono", otro: "Pago" };
  return map[tipo] || "Pago";
};

/** Número de cuota según el orden del pago en el plan (ej. "Pago 2 de 3") */
const obtenerTextoCuota = (plan, pago) => {
  const total = Math.max(1, Number(plan?.cantidad_pagos) || 1);
  const pagos = Array.isArray(plan?.pagos) ? plan.pagos : [];
  const pagoId = Number(pago?.pago_cliente_id);

  let numero = pagos.findIndex((item) => Number(item.pago_cliente_id) === pagoId) + 1;
  if (numero <= 0) {
    numero = pagos.length > 0 ? pagos.length : 1;
  }

  return `Pago ${numero} de ${total}`;
};

const formatearFechaRecibo = (fecha) => {
  if (!fecha) return { fecha: "—", hora: "" };

  const texto = String(fecha);
  const soloFecha = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = soloFecha
    ? new Date(`${soloFecha[1]}T12:00:00`)
    : new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return { fecha: texto, hora: "" };
  }

  const fechaStr = date.toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const esMedianoche =
    soloFecha &&
    (texto.includes("00:00:00") || !texto.match(/\d{2}:\d{2}/));

  return {
    fecha: fechaStr,
    hora: esMedianoche
      ? ""
      : date.toLocaleTimeString("es-GT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
  };
};

const medirTexto = (doc, texto, opciones = {}) => {
  const { width = 200, font, fontSize } = opciones;
  if (font) doc.font(font);
  if (fontSize) doc.fontSize(fontSize);
  return doc.heightOfString(String(texto ?? "—"), { width });
};

const dibujarEncabezado = (doc, pago) => {
  const w = doc.page.width;
  const cw = contentWidth(doc);
  const metaW = Math.min(200, cw * 0.42);
  const metaX = w - MARGIN - metaW;
  const { fecha, hora } = formatearFechaRecibo(pago.fecha_pago);

  doc.rect(0, 0, w, HEADER_H).fill(COLORS.rosa);

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("BeautyBell", MARGIN, 20, { width: metaX - MARGIN - 16, lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text("Recibo de pago", MARGIN, 46, { lineBreak: false });

  let metaY = 18;

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .text("Recibo", metaX, metaY, { width: metaW, align: "right" });
  metaY += 10;

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .text(pago.codigo_recibo || "—", metaX, metaY, { width: metaW, align: "right" });
  metaY += 16;

  doc.font("Helvetica-Bold").fontSize(7.5).text("Fecha", metaX, metaY, {
    width: metaW,
    align: "right",
  });
  metaY += 10;

  doc.font("Helvetica").fontSize(8.5).text(fecha, metaX, metaY, {
    width: metaW,
    align: "right",
  });
  metaY += medirTexto(doc, fecha, { width: metaW }) + 2;

  if (hora) {
    doc.font("Helvetica").fontSize(8).text(hora, metaX, metaY, {
      width: metaW,
      align: "right",
    });
  }

  doc.fillColor(COLORS.text);
};

const medirCampo = (doc, valor, ancho) => {
  const valorStr = String(valor ?? "—").trim() || "—";
  const altoValor = medirTexto(doc, valorStr, {
    width: ancho,
    font: "Helvetica-Bold",
    fontSize: 10,
  });
  return 11 + altoValor + 10;
};

const dibujarCampo = (doc, label, valor, x, y, ancho) => {
  const valorStr = String(valor ?? "—").trim() || "—";

  doc.fillColor(COLORS.muted).font("Helvetica").fontSize(8).text(label, x, y, {
    width: ancho,
  });

  doc
    .fillColor(COLORS.text)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(valorStr, x, y + 11, { width: ancho });

  return medirCampo(doc, valor, ancho);
};

const dibujarCajaCliente = (doc, y, plan, pago) => {
  const cw = contentWidth(doc);
  const colGap = 16;
  const colW = (cw - PAD * 2 - colGap) / 2;
  const x1 = MARGIN + PAD;
  const x2 = x1 + colW + colGap;

  const textoCuota = obtenerTextoCuota(plan, pago);

  const filas = [
    [
      { label: "Cliente", valor: plan.cliente_nombre },
      { label: "Teléfono", valor: plan.cliente_telefono || "—" },
    ],
    [
      { label: "Cotización", valor: plan.codigo_cotizacion },
      { label: "Plan de pago", valor: plan.codigo_plan },
    ],
    [
      { label: "Cuota", valor: textoCuota },
      { label: "Tipo de pago", valor: etiquetaTipoPago(pago.tipo_pago) },
    ],
    [
      { label: "No. transferencia", valor: pago.numero_transferencia || "—" },
      null,
    ],
  ];

  let contenidoH = PAD;
  filas.forEach(([izq, der]) => {
    const hIzq = medirCampo(doc, izq.valor, colW);
    const hDer = der ? medirCampo(doc, der.valor, colW) : 0;
    contenidoH += Math.max(hIzq, hDer);
  });

  const boxH = contenidoH + PAD;
  doc.roundedRect(MARGIN, y, cw, boxH, 6).fillAndStroke(COLORS.surface, COLORS.border);

  let rowY = y + PAD;
  filas.forEach(([izq, der]) => {
    const hIzq = dibujarCampo(doc, izq.label, izq.valor, x1, rowY, colW);
    const hDer = der
      ? dibujarCampo(doc, der.label, der.valor, x2, rowY, colW)
      : 0;
    rowY += Math.max(hIzq, hDer);
  });

  return y + boxH;
};

const dibujarMontoRecibido = (doc, y, monto) => {
  const cw = contentWidth(doc);
  const textoMonto = formatearMoneda(monto);
  const labelH = 14;
  const montoH = medirTexto(doc, textoMonto, {
    width: cw,
    font: "Helvetica-Bold",
    fontSize: 24,
  });
  const boxH = PAD + labelH + montoH + PAD;

  doc.roundedRect(MARGIN, y, cw, boxH, 6).fill(COLORS.rosa);

  doc
    .fillColor(COLORS.white)
    .font("Helvetica")
    .fontSize(10)
    .text("Monto recibido", MARGIN, y + PAD, { width: cw, align: "center" });

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(textoMonto, MARGIN, y + PAD + labelH, { width: cw, align: "center" });

  return y + boxH;
};

const medirFilaResumen = (doc, label, valor, cw) => {
  const valorW = 130;
  const labelW = cw - valorW - PAD * 2 - 8;
  const hLabel = medirTexto(doc, label, { width: labelW, fontSize: 8.5 });
  const hValor = medirTexto(doc, valor, {
    width: valorW,
    font: "Helvetica-Bold",
    fontSize: 9.5,
  });
  return Math.max(hLabel, hValor, 14) + 4;
};

const dibujarFilaResumen = (doc, label, valor, x, y, cw) => {
  const labelX = x + PAD;
  const valorW = 130;
  const labelW = cw - valorW - PAD * 2 - 8;
  const valorX = x + cw - valorW - PAD;

  doc.fillColor(COLORS.muted).font("Helvetica").fontSize(8.5).text(label, labelX, y, {
    width: labelW,
  });

  doc
    .fillColor(COLORS.text)
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .text(valor, valorX, y, { width: valorW, align: "right" });

  return medirFilaResumen(doc, label, valor, cw);
};

const dibujarResumenPlan = (doc, y, plan, pago) => {
  const cw = contentWidth(doc);
  const x = MARGIN;
  const innerW = cw - PAD * 2;

  const items = [
    ["Valor a cobrar", formatearMoneda(plan.valor_a_cobrar)],
    ["Total abonado", formatearMoneda(plan.total_abonado)],
    ["Saldo pendiente", formatearMoneda(plan.saldo_pendiente)],
    ["Cuotas planificadas", String(plan.cantidad_pagos ?? "—")],
  ];

  const notas = pago.notas ? truncarTexto(pago.notas, 200) : "";
  const tituloH = 22;
  let filasH = 0;
  items.forEach(([label, val]) => {
    filasH += medirFilaResumen(doc, label, val, cw);
  });

  let notasH = 0;
  if (notas) {
    notasH = 10 + medirTexto(doc, notas, { width: innerW, fontSize: 9 }) + 6;
  }

  const boxH = PAD + tituloH + filasH + notasH + PAD;

  doc.roundedRect(x, y, cw, boxH, 6).stroke(COLORS.border);

  let cy = y + PAD;
  doc
    .fillColor(COLORS.textSoft)
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .text("Resumen del plan", x + PAD, cy, { width: innerW });
  cy += tituloH;

  items.forEach(([label, val]) => {
    const rowH = dibujarFilaResumen(doc, label, val, x, cy, cw);
    cy += rowH;
  });

  if (notas) {
    cy += 4;
    doc.fillColor(COLORS.muted).font("Helvetica").fontSize(8).text("Notas", x + PAD, cy, {
      width: innerW,
    });
    cy += 11;
    doc
      .fillColor(COLORS.text)
      .font("Helvetica")
      .fontSize(9)
      .text(notas, x + PAD, cy, { width: innerW });
  }

  return y + boxH;
};

const dibujarPie = (doc) => {
  const cw = contentWidth(doc);
  const pieY = doc.page.height - FOOTER_H;

  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .moveTo(MARGIN, pieY)
    .lineTo(MARGIN + cw, pieY)
    .stroke();

  doc
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .fontSize(8)
    .text("powered by Ingeniosos S.A", MARGIN, pieY + 12, {
      width: cw,
      align: "center",
      lineBreak: false,
    });
};

const generarPdfReciboPago = (plan, pago) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      dibujarEncabezado(doc, pago);

      let y = HEADER_H + GAP;
      y = dibujarCajaCliente(doc, y, plan, pago) + GAP;
      y = dibujarMontoRecibido(doc, y, pago.monto) + GAP;
      y = dibujarResumenPlan(doc, y, plan, pago) + GAP;

      dibujarPie(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });

module.exports = { generarPdfReciboPago };
