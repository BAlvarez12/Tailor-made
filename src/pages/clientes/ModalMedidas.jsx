import { useEffect, useState } from "react";
import api from "../../utils/api";
import { getTiposMedida } from "../../services/tipoMedidasService2";
import { toast } from "react-toastify";
import { Ruler, Save, XCircle, ScanLine } from "lucide-react";
import "./clientes.css";

/**
 * Modal unificado para registrar / actualizar medidas de un cliente.
 *
 * Props:
 *   cliente               objeto cliente (acepta forma `nombre/apellido` o
 *                         `nombre_cliente/apellido_cliente`)
 *   onClose               callback para cerrar el modal
 *   onGuardado            callback opcional que se invoca tras guardar
 *   sinMedidasRegistradas si es true (ej. cliente recién creado) se evita
 *                         la consulta GET y entra directo en modo "registro
 *                         inicial". Si es false, consulta las medidas
 *                         existentes y decide entre POST y PUT.
 */
function ModalMedidas({
  cliente,
  onClose,
  onGuardado,
  sinMedidasRegistradas = false,
}) {
  const [medidas, setMedidas] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);
  const [esRegistroInicial, setEsRegistroInicial] = useState(sinMedidasRegistradas);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargar = async () => {
    try {
      // Cliente recién creado: solo cargamos tipos, no consultamos medidas
      if (sinMedidasRegistradas) {
        const tipos = await getTiposMedida();
        setMedidas(
          tipos.map((t) => ({
            tipo_medida_id: t.tipo_medida_id,
            nombre_tipo_medida: t.nombre_tipo_medida,
            valor: "",
          }))
        );
        setEsRegistroInicial(true);
        return;
      }

      const [resMedidas, tiposActivos] = await Promise.all([
        api.get(`/clientes/medidas/cliente/${cliente.cliente_id}`),
        getTiposMedida(),
      ]);

      const medidasExistentes = resMedidas.data?.data ?? resMedidas.data ?? [];

      const mapaExistentes = {};
      medidasExistentes.forEach((m) => {
        mapaExistentes[m.tipo_medida_id] = m;
      });

      const medidasCompletas = tiposActivos.map((t) => ({
        cliente_medida_id:
          mapaExistentes[t.tipo_medida_id]?.cliente_medida_id || null,
        tipo_medida_id: t.tipo_medida_id,
        nombre_tipo_medida: t.nombre_tipo_medida,
        valor: mapaExistentes[t.tipo_medida_id]?.valor ?? "",
      }));

      const valoresIniciales = {};
      medidasCompletas.forEach((m) => {
        valoresIniciales[m.tipo_medida_id] = m.valor;
      });

      setMedidas(medidasCompletas);
      setValores(valoresIniciales);

      const tieneRegistradas = medidasExistentes.some(
        (m) => m.valor !== "" && m.valor !== null && m.valor !== undefined
      );
      setEsRegistroInicial(!tieneRegistradas);
    } catch (error) {
      console.error("Error cargando medidas:", error);
      toast.error("Error al cargar medidas del cliente");
    }
  };

  const handleChange = (id, value) => {
    setValores((prev) => ({ ...prev, [id]: value }));
  };

  const guardar = async () => {
    try {
      setLoading(true);

      const data = Object.keys(valores)
        .filter(
          (id) =>
            valores[id] !== "" &&
            valores[id] !== null &&
            valores[id] !== undefined
        )
        .map((id) => ({
          tipo_medida_id: Number(id),
          valor: valores[id],
        }));

      if (data.length === 0) {
        toast.error("Debes ingresar al menos una medida");
        return;
      }

      const payload = {
        cliente_id: cliente.cliente_id,
        medidas: data,
      };

      if (esRegistroInicial) {
        await api.post("/clientes/medidas", payload);
        toast.success("Medidas del cliente registradas con éxito");
      } else {
        await api.put("/clientes/medidas", payload);
        toast.success("Medidas del cliente actualizadas con éxito");
      }

      if (onGuardado) await onGuardado();
      onClose();
    } catch (error) {
      console.error("Error guardando medidas:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error al guardar medidas del cliente"
      );
    } finally {
      setLoading(false);
    }
  };

  // Acepta tanto `{ nombre, apellido }` (cliente recién creado) como
  // `{ nombre_cliente, apellido_cliente }` (cliente de la lista).
  const nombreCompleto = `${
    cliente?.nombre_cliente ?? cliente?.nombre ?? ""
  } ${cliente?.apellido_cliente ?? cliente?.apellido ?? ""}`.trim();

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div
        className="tm-modal tm-modal--medidas-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tm-modal__header">
          <div className="tm-modal__title-wrap">
            <div className="tm-modal__title-icon">
              <Ruler size={22} />
            </div>
            <div>
              <h2>
                {esRegistroInicial ? "Registrar medidas" : "Actualizar medidas"}
              </h2>
              <p className="tm-modal__subtitle">{nombreCompleto}</p>
            </div>
          </div>

          <button className="tm-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tm-modal__form tm-modal__scroll">
          {esRegistroInicial && (
            <p className="tm-modal__aviso">
              Este cliente no cuenta con medidas registradas. Ingresa las
              medidas necesarias y guarda para continuar.
            </p>
          )}

          <div className="tm-modal__section">
            <p className="tm-modal__section-title">
              <ScanLine size={16} />
              {esRegistroInicial
                ? "Registro de medidas del cliente"
                : "Medidas activas del cliente"}
            </p>

            <div className="tm-medidas-grid-4">
              {medidas.map((m) => (
                <div key={m.tipo_medida_id} className="tm-medida-item">
                  <label>{m.nombre_tipo_medida}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={valores[m.tipo_medida_id] ?? ""}
                    onChange={(e) =>
                      handleChange(m.tipo_medida_id, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="tm-modal__actions">
            <button
              className="tm-modal__btn tm-modal__btn--secondary"
              onClick={onClose}
            >
              <XCircle size={16} />
              Cancelar
            </button>

            <button
              className="tm-modal__btn tm-modal__btn--primary"
              onClick={guardar}
              disabled={loading}
            >
              <Save size={16} />
              {loading
                ? "Guardando..."
                : esRegistroInicial
                  ? "Guardar medidas"
                  : "Actualizar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalMedidas;
