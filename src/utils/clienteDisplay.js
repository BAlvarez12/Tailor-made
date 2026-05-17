export const obtenerTelefonoCliente = (cliente) => {
  if (!cliente) return "";
  return String(
    cliente.telefono ??
      cliente.Telefono ??
      cliente.numero_telefono ??
      cliente.telefono_cliente ??
      ""
  ).trim();
};

export const normalizarCliente = (cliente) => ({
  ...cliente,
  nombre_cliente: cliente.nombre_cliente ?? cliente.nombre ?? "",
  apellido_cliente: cliente.apellido_cliente ?? cliente.apellido ?? "",
  telefono: obtenerTelefonoCliente(cliente),
});

export const formatearNombreCliente = (cliente) => {
  if (!cliente) return "";
  return `${cliente.nombre_cliente || ""} ${cliente.apellido_cliente || ""}`.trim();
};

export const formatearClienteDisplay = (cliente) => {
  const nombre = formatearNombreCliente(cliente);
  const telefono = obtenerTelefonoCliente(cliente);
  if (nombre && telefono) return `${nombre} · ${telefono}`;
  return nombre || telefono;
};

const normalizarTelefono = (valor = "") => String(valor).replace(/\D/g, "");

export const clienteCoincideBusqueda = (cliente, texto) => {
  if (!texto) return true;
  const nombreCompleto = formatearNombreCliente(cliente).toLowerCase();
  const telefono = obtenerTelefonoCliente(cliente).toLowerCase();
  const telefonoDigitos = normalizarTelefono(telefono);
  const textoDigitos = normalizarTelefono(texto);
  return (
    nombreCompleto.includes(texto) ||
    telefono.includes(texto) ||
    (textoDigitos.length > 0 && telefonoDigitos.includes(textoDigitos))
  );
};
