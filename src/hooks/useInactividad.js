import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EVENTOS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

/**
 * Cierra sesión automáticamente cuando el usuario no muestra actividad
 * durante `timeoutMs` milisegundos.
 *
 * Reinicia el contador con cada evento de mouse / teclado / scroll / touch.
 * Al expirar: borra token y usuario del localStorage y navega al login.
 */
function useInactividad(timeoutMs = 30 * 60 * 1000) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const cerrarSesion = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      navigate("/", { replace: true });
    };

    const reiniciar = () => {
      clearTimeout(timer);
      timer = setTimeout(cerrarSesion, timeoutMs);
    };

    EVENTOS.forEach((evt) =>
      window.addEventListener(evt, reiniciar, { passive: true })
    );
    reiniciar();

    return () => {
      clearTimeout(timer);
      EVENTOS.forEach((evt) => window.removeEventListener(evt, reiniciar));
    };
  }, [navigate, timeoutMs]);
}

export default useInactividad;
