import { useEffect, useState } from "react";
import axios from "axios";
import "./clientes.css";
import { getTiposMedida } from "../../services/tipoMedidasService2";
import { toast } from "react-toastify";
import { Pencil, User, Phone, ToggleLeft, Save, XCircle, FileText, Ruler, ScanLine } from "lucide-react";

function ModalActualizarMedidas({ cliente, onClose }) {
  const [medidas, setMedidas] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMedidas();
  }, []);

  const cargarMedidas = async () => {
    try {
      const [resMedidas, tiposActivos] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/clientes/medidas/cliente/${cliente.cliente_id}`
        ),
        getTiposMedida()
      ]);

      const medidasExistentes = resMedidas.data || [];

      const mapaExistentes = {};
      medidasExistentes.forEach((m) => {
        mapaExistentes[m.tipo_medida_id] = m;
      });

      const medidasCompletas = tiposActivos.map((t) => ({
        cliente_medida_id: mapaExistentes[t.tipo_medida_id]?.cliente_medida_id || null,
        tipo_medida_id: t.tipo_medida_id,
        nombre_tipo_medida: t.nombre_tipo_medida,
        valor: mapaExistentes[t.tipo_medida_id]?.valor ?? ""
      }));

      const valoresIniciales = {};
      medidasCompletas.forEach((m) => {
        valoresIniciales[m.tipo_medida_id] = m.valor;
      });

      setMedidas(medidasCompletas);
      setValores(valoresIniciales);

    } catch (error) {
      console.error("Error cargando medidas:", error);
      toast.error("Error al cargar medidas del cliente");
    }
  };

  const handleChange = (id, value) => {
    setValores((prev) => ({
      ...prev,
      [id]: value
    }));
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
          valor: valores[id]
        }));

      await axios.put("http://localhost:3000/api/clientes/medidas", {
        cliente_id: cliente.cliente_id,
        usuario: 1,
        medidas: data
      });

      toast.success("Medidas del cliente actualizadas con éxito");
      onClose();
    } catch (error) {
      console.error("Error actualizando medidas:", error);
      toast.error(error?.response?.data?.message || "Error al actualizar medidas del cliente");
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Actualizar Medidas</h2>
            <p className="tm-modal__subtitle">
              {cliente.nombre_cliente} {cliente.apellido_cliente}
            </p>
          </div>
        </div>

        <button className="tm-modal__close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="tm-modal__form tm-modal__scroll">
        <div className="tm-modal__section">
          <p className="tm-modal__section-title">
            <ScanLine size={16} />
            Medidas activas del cliente
          </p>

          <div className="tm-medidas-grid-4">
            {medidas.map((m) => (
              <div key={m.tipo_medida_id} className="tm-medida-item">
                <label>{m.nombre_tipo_medida}</label>

                <input
                  type="number"
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
            {loading ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default ModalActualizarMedidas;