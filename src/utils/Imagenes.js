export const normalizarRespuestaPrenda = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
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

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const backendBase = apiUrl.replace(/\/api\/?$/, "");

  if (url.startsWith("/")) {
    return `${backendBase}${url}`;
  }

  return `${backendBase}/${url}`;
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