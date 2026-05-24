/** Fecha de hoy en formato YYYY-MM-DD para input[type=date] */
export const obtenerFechaHoyInput = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Muestra solo la fecha del pago (sin hora de registro) */
export const formatearFechaPago = (fecha) => {
  if (!fecha) return "—";
  const texto = String(fecha);
  const soloFecha = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = soloFecha
    ? new Date(`${soloFecha[1]}T12:00:00`)
    : new Date(fecha);
  if (Number.isNaN(date.getTime())) return texto;
  return date.toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
