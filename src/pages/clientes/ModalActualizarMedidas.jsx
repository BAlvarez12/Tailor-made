import { useEffect, useState } from "react";
import axios from "axios";
import "./clientes.css";

function ModalActualizarMedidas({ cliente, onClose }) {

  const [medidas, setMedidas] = useState([]);
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMedidas();
  }, []);

  const cargarMedidas = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/clientes/medidas/cliente/${cliente.cliente_id}`
      );

      setMedidas(res.data);

      // 🔥 llenar valores
      const valoresIniciales = {};
      res.data.forEach(m => {
        valoresIniciales[m.tipo_medida_id] = m.valor;
      });

      setValores(valoresIniciales);

    } catch (error) {
      console.error("Error cargando medidas:", error);
    }
  };

  const handleChange = (id, value) => {
    setValores({
      ...valores,
      [id]: value
    });
  };

  const guardar = async () => {
    try {
      setLoading(true);

      const data = Object.keys(valores).map(id => ({
        tipo_medida_id: Number(id),
        valor: valores[id]
      }));

      await axios.put("http://localhost:3000/api/clientes/medidas", {
        cliente_id: cliente.cliente_id,
        usuario: 1,
        medidas: data
      });

      onClose();

    } catch (error) {
      console.error("Error actualizando medidas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal tm-modal--medidas-lg" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="tm-modal__header">
          <div>
            <h2>Actualizar Medidas</h2>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {cliente.nombre_cliente} {cliente.apellido_cliente}
            </p>
          </div>

          <button className="tm-modal__close" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="tm-modal__form tm-modal__scroll">

          <div className="tm-medidas-grid-4">

            {medidas.map(m => (
              <div key={m.tipo_medida_id} className="tm-medida-item">

                <label>{m.nombre_tipo_medida}</label>

                <input
                  type="number"
                  value={valores[m.tipo_medida_id] || ""}
                  onChange={(e) =>
                    handleChange(m.tipo_medida_id, e.target.value)
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
            {loading ? "Guardando..." : "Actualizar"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ModalActualizarMedidas;