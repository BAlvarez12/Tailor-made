const PDFDocument = require("pdfkit");

const MARGIN = 40;
const HEADER_H = 72;
const FOOTER_H = 36;
const GAP = 10;

const COLORS = {
  rosa: "#ec4899",
  text: "#0f172a",
  textSoft: "#334155",
  muted: "#64748b",
  white: "#ffffff",
  border: "#e2e8f0",
  surface: "#f8fafc",
  headerTable: "#475569",
  rowAlt: "#f1f5f9",
};

const formatearMoneda = (valor) => {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "Q 0.00";
  return `Q ${numero.toFixed(2)}`;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return String(fecha);
  return date.toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

const contentWidth = (doc) => doc.page.width - MARGIN * 2;

const pageBottom = (doc) => doc.page.height - FOOTER_H - 56;

const truncarTexto = (texto, max = 80) => {
  const s = String(texto || "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 3)}...`;
};

const limitarFilas = (doc, filas, startY, reservaInferior = 110) => {
  const rowH = 18;
  const headerH = 20;
  const disponible = pageBottom(doc) - startY - reservaInferior;
  const max = Math.max(1, Math.floor((disponible - headerH) / rowH));
  if (filas.length <= max) return { filas, truncado: false };
  return { filas: filas.slice(0, max), truncado: true, omitidas: filas.length - max };
};

const dibujarEncabezado = (doc, cotizacion) => {
  const w = doc.page.width;

  doc.rect(0, 0, w, HEADER_H).fill(COLORS.rosa);

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("BeautyBell", MARGIN, 18, { lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text("Cotización de confección", MARGIN, 44, { lineBreak: false });

  const metaX = w - MARGIN - 180;
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("Código", metaX, 20, { width: 180, align: "right", lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(cotizacion.codigo_cotizacion || "—", metaX, 32, {
      width: 180,
      align: "right",
      lineBreak: false,
    });

  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text("Fecha", metaX, 48, { width: 180, align: "right", lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text(formatearFecha(cotizacion.fecha_creado), metaX, 58, {
      width: 180,
      align: "right",
      lineBreak: false,
    });

  doc.fillColor(COLORS.text);
};

const dibujarTituloSeccion = (doc, titulo, x, y, width) => {
  doc
    .fillColor(COLORS.textSoft)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(titulo, x, y, { width, lineBreak: false });

  const lineY = y + 13;
  doc
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .moveTo(x, lineY)
    .lineTo(x + width, lineY)
    .stroke();

  return lineY + 8;
};

const dibujarBloqueInfo = (doc, x, y, width, titulo, filas) => {
  let cy = dibujarTituloSeccion(doc, titulo, x, y, width);
  const innerH = filas.length * 16 + 10;
  const boxH = innerH + 4;

  doc.roundedRect(x, cy, width, boxH, 4).fillAndStroke(COLORS.surface, COLORS.border);

  let rowY = cy + 8;
  filas.forEach((fila) => {
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(7.5)
      .text(`${fila.label}:`, x + 8, rowY, { width: 70, lineBreak: false });

    doc
      .fillColor(COLORS.text)
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(fila.valor || "—", x + 78, rowY, {
        width: width - 86,
        lineBreak: false,
      });

    rowY += 16;
  });

  return cy + boxH + GAP;
};

const dibujarTablaCompacta = (doc, x, y, width, columnas, filas, mensajeVacio, avisoExtra) => {
  const rowH = 18;
  const headerH = 20;
  const maxFilas = Math.max(filas.length, 1);
  const tableH = headerH + maxFilas * rowH + 2;

  const colWidths = columnas.map((c) => (width * c.width) / 100);
  let ty = y;

  doc.roundedRect(x, ty, width, tableH, 4).stroke(COLORS.border);
  doc.rect(x, ty, width, headerH).fill(COLORS.headerTable);

  let colX = x;
  columnas.forEach((col, i) => {
    doc
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(col.titulo, colX + 5, ty + 6, {
        width: colWidths[i] - 10,
        lineBreak: false,
      });
    colX += colWidths[i];
  });

  ty += headerH;

  if (filas.length === 0) {
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(8)
      .text(mensajeVacio, x + 6, ty + 5, {
        width: width - 12,
        lineBreak: false,
      });
    return y + tableH + GAP;
  }

  filas.forEach((fila, idx) => {
    if (idx % 2 === 1) {
      doc.rect(x, ty, width, rowH).fill(COLORS.rowAlt);
    }

    colX = x;
    fila.celdas.forEach((celda, i) => {
      doc
        .fillColor(COLORS.text)
        .font(celda.bold ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8)
        .text(String(celda.texto ?? "—"), colX + 5, ty + 5, {
          width: colWidths[i] - 10,
          lineBreak: false,
        });
      colX += colWidths[i];
    });

    ty += rowH;
  });

  let endY = y + tableH + 6;
  if (avisoExtra) {
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(7)
      .text(avisoExtra, x, endY, { width, lineBreak: false });
    endY += 12;
  }

  return endY + GAP;
};

const dibujarTotal = (doc, valorTotal, y) => {
  const cw = contentWidth(doc);
  const boxH = 48;
  const bottom = pageBottom(doc);

  let boxY = y;
  if (boxY + boxH > bottom - 8) {
    boxY = bottom - boxH - 8;
  }

  doc
    .roundedRect(MARGIN, boxY, cw, boxH, 6)
    .fillAndStroke(COLORS.surface, COLORS.border);

  doc
    .fillColor(COLORS.textSoft)
    .font("Helvetica")
    .fontSize(10)
    .text("Costo total del trabajo", MARGIN + 14, boxY + 10, {
      width: cw - 28,
      lineBreak: false,
    });

  doc
    .fillColor(COLORS.text)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(formatearMoneda(valorTotal), MARGIN + 14, boxY + 24, {
      width: cw - 28,
      align: "right",
      lineBreak: false,
    });

  return boxY + boxH;
};

const dibujarPie = (doc) => {
  const cw = contentWidth(doc);
  const y = doc.page.height - FOOTER_H + 10;

  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .moveTo(MARGIN, y - 6)
    .lineTo(MARGIN + cw, y - 6)
    .stroke();

  doc
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .fontSize(8)
    .text("powered by Tailor-made", MARGIN, y, {
      width: cw,
      align: "center",
      lineBreak: false,
    });
};

const generarPdfCotizacion = (cotizacion) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      dibujarEncabezado(doc, cotizacion);

      const cw = contentWidth(doc);
      const halfW = (cw - GAP) / 2;
      let y = HEADER_H + 16;

      const filasCliente = [
        { label: "Nombre", valor: cotizacion.cliente_nombre },
        { label: "Teléfono", valor: cotizacion.cliente_telefono },
      ];
      const filasPrenda = [
        { label: "Tipo", valor: cotizacion.tipo_prenda_nombre },
      ];
      if (cotizacion.titulo_prenda) {
        filasPrenda.push({
          label: "Referencia",
          valor: cotizacion.titulo_prenda,
        });
      }

      const yCliente = dibujarBloqueInfo(
        doc,
        MARGIN,
        y,
        halfW,
        "Datos del cliente",
        filasCliente
      );
      const yPrenda = dibujarBloqueInfo(
        doc,
        MARGIN + halfW + GAP,
        y,
        halfW,
        "Tipo de prenda",
        filasPrenda
      );
      y = Math.max(yCliente, yPrenda) + 4;

      const medidasRaw = cotizacion.medidas || [];
      const materialesRaw = cotizacion.materiales || [];

      const yMedidas = dibujarTituloSeccion(
        doc,
        "Medidas del cliente",
        MARGIN,
        y,
        halfW
      );
      const yMateriales = dibujarTituloSeccion(
        doc,
        "Materiales a utilizar",
        MARGIN + halfW + GAP,
        y,
        halfW
      );

      const medidasMap = medidasRaw.map((m) => ({
        celdas: [
          { texto: truncarTexto(m.nombre_tipo_medida, 28) },
          { texto: m.valor != null ? String(m.valor) : "—", bold: true },
          { texto: m.unidad_label || "—" },
        ],
      }));
      const limiteMed = limitarFilas(doc, medidasMap, yMedidas);
      const avisoMed = limiteMed.truncado
        ? `+${limiteMed.omitidas} medida(s) más (ver sistema)`
        : null;

      const yTablaMedidas = dibujarTablaCompacta(
        doc,
        MARGIN,
        yMedidas,
        halfW,
        [
          { titulo: "Medida", width: 48 },
          { titulo: "Valor", width: 22 },
          { titulo: "Unid.", width: 30 },
        ],
        limiteMed.filas,
        "Sin medidas.",
        avisoMed
      );

      const materialesMap = materialesRaw.map((mat) => {
          const cantidad = Number(mat.cantidad) || 0;
          const nombre =
            mat.observaciones && String(mat.observaciones).trim()
              ? `${mat.nombre_material} (${mat.observaciones})`
              : mat.nombre_material || "—";

          return {
            celdas: [
              { texto: truncarTexto(nombre, 40) },
              { texto: cantidad.toFixed(2), bold: true },
            ],
          };
        });
      const limiteMat = limitarFilas(doc, materialesMap, yMateriales);
      const avisoMat = limiteMat.truncado
        ? `+${limiteMat.omitidas} material(es) más`
        : null;

      const yTablaMateriales = dibujarTablaCompacta(
        doc,
        MARGIN + halfW + GAP,
        yMateriales,
        halfW,
        [
          { titulo: "Material", width: 72 },
          { titulo: "Cantidad", width: 28 },
        ],
        limiteMat.filas,
        "Sin materiales.",
        avisoMat
      );

      y = Math.max(yTablaMedidas, yTablaMateriales) + 4;

      if (cotizacion.notas && String(cotizacion.notas).trim()) {
        y = dibujarTituloSeccion(doc, "Notas", MARGIN, y, cw);
        const notasH = 28;
        doc.roundedRect(MARGIN, y, cw, notasH, 4).fillAndStroke(COLORS.surface, COLORS.border);
        doc
          .fillColor(COLORS.text)
          .font("Helvetica")
          .fontSize(8)
          .text(truncarTexto(cotizacion.notas, 160), MARGIN + 10, y + 8, {
            width: cw - 20,
            lineBreak: false,
          });
        y += notasH + GAP;
      }

      dibujarTotal(doc, cotizacion.valor_total, y);
      dibujarPie(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generarPdfCotizacion, formatearMoneda };
