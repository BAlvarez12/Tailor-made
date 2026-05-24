/**
 * Convierte fecha del cliente (input type="date" o ISO) a DATETIME MySQL.
 * @returns {string|null}
 */
const normalizarFechaPago = (valor) => {
  if (valor === null || valor === undefined || valor === "") return null;

  const str = String(valor).trim();
  if (!str) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return `${str} 00:00:00`;
  }

  const match = str.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]} ${match[2]}:${match[3]}:00`;
  }

  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return null;

  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

module.exports = { normalizarFechaPago };
