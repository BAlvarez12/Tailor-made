import { useEffect, useState } from "react";

const KEY = "tema";

const obtenerTemaInicial = () => {
  const guardado = localStorage.getItem(KEY);
  if (guardado === "dark" || guardado === "light") return guardado;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * Hook para alternar entre tema claro y oscuro.
 *
 * Aplica `data-theme` en <html>, persiste la preferencia y respeta
 * el `prefers-color-scheme` del sistema en la primera visita.
 */
function useTema() {
  const [tema, setTema] = useState(obtenerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(KEY, tema);
  }, [tema]);

  const alternar = () => setTema((t) => (t === "dark" ? "light" : "dark"));

  return { tema, alternar };
}

export default useTema;
