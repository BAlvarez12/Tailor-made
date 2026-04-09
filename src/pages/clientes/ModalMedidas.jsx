import { useEffect, useState } from "react";
import "./clientes.css";
import axios from "axios";
import { getTiposMedida } from "../../services/tipoMedidasService2";
import { toast } from "react-toastify";
import { Ruler, Save, XCircle, ScanLine } from "lucide-react";

function ModalMedidas({ cliente, onClose }) {
  const [tipos, setTipos] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerTipos();
  }, []);

  const obtenerTipos = async () => {
    try {
      const data = await getTiposMedida();
      setTipos(data);
    } catch (error) {
      console.error("Error cargando tipos:", error);
      toast.error("Error al cargar tipos de medida");
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

      if (Object.keys(valores).length === 0) {
        toast.error("Debes ingresar al menos una medida");
        setLoading(false);
        return;
      }

      const medidas = Object.keys(valores)
        .filter((id) => valores[id] !== "" && valores[id] !== null)
        .map((id) => ({
          tipo_medida_id: Number(id),
          valor: valores[id]
        }));

      await axios.post("http://localhost:3000/api/clientes/medidas", {
        cliente_id: cliente.cliente_id,
        usuario: 1,
        medidas
      });

      toast.success("Medidas del cliente guardadas con éxito");
      onClose();
    } catch (error) {
      console.error("Error guardando medidas:", error);
      toast.error(error?.response?.data?.message || "Error al guardar medidas del cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal tm-modal--medidas" onClick={(e) => e.stopPropagation()}>
        <div className="tm-modal__header">
          <div className="tm-modal__title-wrap">
            <div className="tm-modal__title-icon">
              <Ruler size={22} />
            </div>
            <div>
              <h2>Medidas del Cliente</h2>
              <p className="tm-modal__subtitle">
                {cliente.nombre} {cliente.apellido} - {cliente.telefono}
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
              Registro inicial de medidas
            </p>

            <div className="tm-medidas-grid">
              {tipos.map((t) => (
                <div className="tm-medida-item" key={t.tipo_medida_id}>
                  <label>{t.nombre_tipo_medida}</label>

                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      handleChange(t.tipo_medida_id, e.target.value)
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
              {loading ? "Guardando..." : "Guardar medidas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalMedidas;