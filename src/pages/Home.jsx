import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Package,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "./Home.css";

const MODULOS = [
  {
    id: "clientes",
    titulo: "Clientes",
    descripcion:
      "Administra la información general de tus clientes y sus datos de contacto.",
    ruta: "/home/clientes",
    icono: Users,
    acento: "indigo",
  },
  {
    id: "cotizaciones",
    titulo: "Cotizaciones",
    descripcion:
      "Crea cotizaciones, consulta el historial y genera PDF con encabezado BeautyBell.",
    ruta: "/home/cotizaciones",
    icono: FileText,
    acento: "violet",
  },
  {
    id: "pagos",
    titulo: "Pagos",
    descripcion:
      "Asocia cotizaciones con planes de pago, registra abonos y genera recibos PDF.",
    ruta: "/home/pagos",
    icono: Wallet,
    acento: "amber",
  },
  {
    id: "materiales",
    titulo: "Materiales",
    descripcion:
      "Controla insumos, materiales y disponibilidad para tus prendas.",
    ruta: "/home/materiales",
    icono: Package,
    acento: "emerald",
  },
];

function obtenerNombreUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    return usuario.nombre || usuario.usuario || "Usuario";
  } catch {
    return "Usuario";
  }
}

function Home() {
  const navigate = useNavigate();
  const nombre = obtenerNombreUsuario();

  const irAModulo = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="tm-home">
      <header className="tm-home__hero">
        <div className="tm-home__hero-content">
          <span className="tm-home__eyebrow">
            <Sparkles size={14} aria-hidden />
            Panel principal
          </span>
          <h1>Bienvenido, {nombre}</h1>
          <p>
            Accede rápido a los módulos del sistema. Elige una opción para
            comenzar.
          </p>
        </div>
      </header>

      <section className="tm-home__grid" aria-label="Accesos rápidos">
        {MODULOS.map((modulo) => {
          const Icono = modulo.icono;

          return (
            <button
              key={modulo.id}
              type="button"
              className={`tm-home__card tm-home__card--${modulo.acento}`}
              onClick={() => irAModulo(modulo.ruta)}
            >
              <span
                className={`tm-home__card-icon tm-home__card-icon--${modulo.acento}`}
                aria-hidden
              >
                <Icono size={24} strokeWidth={2} />
              </span>

              <span className="tm-home__card-body">
                <span className="tm-home__card-title">{modulo.titulo}</span>
                <span className="tm-home__card-desc">{modulo.descripcion}</span>
              </span>

              <span className="tm-home__card-action">
                Ir al módulo
                <ArrowRight size={16} aria-hidden />
              </span>
            </button>
          );
        })}
      </section>
    </div>
  );
}

export default Home;
