export const etiquetaTipoPago = (tipo) => {
  const map = { anticipo: "Anticipo", abono: "Abono", otro: "Otro" };
  return map[tipo] || "Pago";
};

/** Texto de cuota para un pago en el historial (índice 0-based) */
export const textoCuotaPago = (plan, indice) => {
  const total = Math.max(1, Number(plan?.cantidad_pagos) || 1);
  const numero = indice + 1;
  return `Pago ${numero} de ${total}`;
};

/** Cuotas realizadas vs planificadas (ej. "1 / 3") */
export const formatearCuotasPlan = (plan) => {
  const total = Math.max(1, Number(plan?.cantidad_pagos) || 1);
  const hechos =
    plan?.pagos_registrados != null
      ? Number(plan.pagos_registrados)
      : Array.isArray(plan?.pagos)
        ? plan.pagos.length
        : 0;
  return `${hechos} / ${total}`;
};

/**
 * Calcula el próximo número de pago y monto sugerido según saldo pendiente
 * y cuotas restantes del plan.
 */
export const calcularProximoAbono = (plan) => {
  const totalCuotas = Math.max(1, Number(plan?.cantidad_pagos) || 1);
  const pagosHechos = Array.isArray(plan?.pagos)
    ? plan.pagos.length
    : Number(plan?.pagos_registrados) || 0;
  const saldo = Math.max(0, Number(plan?.saldo_pendiente) || 0);
  const numeroPago = pagosHechos + 1;
  const cuotasRestantes = Math.max(1, totalCuotas - pagosHechos);

  let montoSugerido = saldo;

  if (numeroPago < totalCuotas && cuotasRestantes > 1) {
    montoSugerido = Math.round((saldo / cuotasRestantes) * 100) / 100;
  }

  const esUltimaCuota = numeroPago >= totalCuotas || cuotasRestantes <= 1;

  return {
    numeroPago,
    totalCuotas,
    pagosHechos,
    cuotasRestantes,
    montoSugerido,
    esUltimaCuota,
    saldoPendiente: saldo,
  };
};

/**
 * Cuota referencial al crear plan.
 * Si hay anticipo, cuenta como pago 1: el saldo se divide entre las cuotas restantes.
 */
export const calcularCuotaReferencial = (
  valorACobrar,
  cantidadPagos,
  valorAnticipo = 0,
  conAnticipo = false
) => {
  const total = Number(valorACobrar) || 0;
  const cuotasTotales = Math.max(1, Number(cantidadPagos) || 1);
  const anticipo = conAnticipo ? Number(valorAnticipo) || 0 : 0;
  const saldo = Math.max(0, total - anticipo);
  const cuotasRestantes =
    anticipo > 0 ? Math.max(1, cuotasTotales - 1) : cuotasTotales;
  return Math.round((saldo / cuotasRestantes) * 100) / 100;
};
