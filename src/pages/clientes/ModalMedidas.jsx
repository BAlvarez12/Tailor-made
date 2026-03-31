import { useEffect, useState } from "react";
import "./clientes.css";
import axios from "axios";
import { getTiposMedida } from "../../services/tipoMedidasService2";

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
    }
  };

  const handleChange = (id, value) => {
    setValores(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const guardar = async () => {
    try {
      setLoading(true);

      // 🔥 VALIDACIÓN
      if (Object.keys(valores).length === 0) {
        alert("Debes ingresar al menos una medida");
        setLoading(false);
        return;
      }

      // 🔥 LIMPIAR VACÍOS
      const medidas = Object.keys(valores)
        .filter(id => valores[id] !== "" && valores[id] !== null)
        .map(id => ({
          tipo_medida_id: Number(id),
          valor: valores[id]
        }));

      await axios.post("http://localhost:3000/api/clientes/medidas", {
        cliente_id: cliente.clienteId,
        usuario: 1,
        medidas
      });

      onClose();

    } catch (error) {
      console.error("Error guardando medidas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal tm-modal--medidas" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="tm-modal__header">
          <div>
            <h2>Medidas del Cliente</h2>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {cliente.nombre} {cliente.apellido} - {cliente.telefono}
            </p>
          </div>

          <button className="tm-modal__close" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="tm-modal__form tm-modal__scroll">

          <div className="tm-medidas-grid">

            {tipos.map(t => (
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

        {/* FOOTER */}
        <div className="tm-modal__actions">

          <button
            className="tm-modal__btn tm-modal__btn--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="tm-modal__btn tm-modal__btn--primary"
            onClick={guardar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar medidas"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ModalMedidas;