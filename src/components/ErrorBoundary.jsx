import { Component } from "react";
import "./ErrorBoundary.css";

/**
 * Captura errores no manejados en cualquier componente hijo y muestra un
 * fallback amigable en lugar de dejar la pantalla en blanco.
 *
 * React solo soporta error boundaries en componentes de clase (a hoy).
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // En producción se podría enviar a un servicio (Sentry, Datadog, etc.)
    console.error("[ErrorBoundary] Error no manejado:", error);
    console.error("[ErrorBoundary] Stack:", info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleVolverInicio = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary">
        <div className="error-boundary__card">
          <div className="error-boundary__icon" aria-hidden>⚠️</div>
          <h1 className="error-boundary__title">Algo salió mal</h1>
          <p className="error-boundary__message">
            Ocurrió un error inesperado al mostrar esta sección. El equipo ya
            tiene el detalle en consola.
          </p>

          {this.state.error?.message && (
            <pre className="error-boundary__detail">
              {String(this.state.error.message)}
            </pre>
          )}

          <div className="error-boundary__actions">
            <button
              type="button"
              className="error-boundary__btn error-boundary__btn--primary"
              onClick={this.handleReload}
            >
              Recargar página
            </button>
            <button
              type="button"
              className="error-boundary__btn"
              onClick={this.handleVolverInicio}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
