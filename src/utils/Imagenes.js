const urlArchivoBackend = (ruta) => {
  const base = import.meta.env.VITE_BACKEND_URL || ''
  if (!ruta) return ''
  if (ruta.startsWith('http://') || ruta.startsWith('https://')) return ruta
  const path = ruta.startsWith('/') ? ruta : `/${ruta}`
  return `${base.replace(/\/$/, '')}${path}`
}

export const normalizarRespuestaPrenda = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export const obtenerDetallePrenda = (data) => {
  const detalle = data?.data ?? data?.prenda ?? data;
  if (Array.isArray(detalle)) return detalle[0] || null;
  if (detalle && typeof detalle === "object") return detalle;
  return null;
};

export const obtenerImagenesPrenda = (prenda) => {
  if (!prenda) return [];

  const imagenes = prenda?.imagenes || prenda?.cliente_prenda_img || [];

  if (Array.isArray(imagenes) && imagenes.length > 0) {
    return imagenes
      .map((img) => {
        if (!img) return "";

        if (typeof img === "string") return img;

        if (typeof img === "object") {
          return img.url_img || img.url || "";
        }

        return "";
      })
      .filter(Boolean);
  }

  if (prenda?.imagen_principal) {
    return [prenda.imagen_principal];
  }

  if (prenda?.url_img) {
    return [prenda.url_img];
  }

  return [];
};

export const construirUrlImagenPrenda = (url) => {
  if (!url) return "";

  if (url.startsWith("/")) {
    return urlArchivoBackend(url);
  }

  if (!url.includes("/")) {
    return urlArchivoBackend(`/uploads/prendas/${url}`);
  }

  return urlArchivoBackend(url);
};

export const obtenerImagenActualPrenda = (prenda, imageIndexes, obtenerIdPrenda) => {
  const id = obtenerIdPrenda(prenda);
  const imagenes = obtenerImagenesPrenda(prenda);

  if (imagenes.length === 0) return "";

  const currentIndex = imageIndexes[id] || 0;
  const safeIndex = currentIndex >= imagenes.length ? 0 : currentIndex;

  return construirUrlImagenPrenda(imagenes[safeIndex]);
};

export const cambiarImagenPrenda = (prendaId, total, direction, setImageIndexes) => {
  if (!prendaId || total <= 1) return;

  setImageIndexes((prev) => {
    const current = prev[prendaId] || 0;
    const nextIndex =
      direction === "next"
        ? (current + 1) % total
        : (current - 1 + total) % total;

    return {
      ...prev,
      [prendaId]: nextIndex,
    };
  });
};