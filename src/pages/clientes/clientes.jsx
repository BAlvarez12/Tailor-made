import React, { useEffect, useState } from "react";
import { getClientes } from "../../services/clienteService";
import "./clientes.css";
import CrearCliente from "./CrearCliente";
import EditarCliente from "./EditarCliente";
import ModalMedidas from "./ModalMedidas";
import ModalActualizarMedidas from "./ModalActualizarMedidas";

function Clientes() {

  const [clientes, setClientes] = useState([]);
  const [showCrear, setShowCrear] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  // 🔥 NUEVO
  const [showMedidas, setShowMedidas] = useState(false);
  const [clienteMedidas, setClienteMedidas] = useState(null);

  //actualizar medidas del cliente
  const [showActualizar, setShowActualizar] = useState(false);
  const [clienteActualizar, setClienteActualizar] = useState(null);
  

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  // 🔥 NUEVO
  const handleSuccess = (data) => {
    cargarClientes();

    if (data) {
      setClienteMedidas(data);
      setShowMedidas(true);
    }
  };

  return (
    <div className="clientes-container">

      {/* HEADER */}
      <div className="clientes-header">
        <h2>Clientes</h2>

        <button
          className="btn-crear"
          onClick={() => setShowCrear(true)}
        >
          + Crear cliente
        </button>
      </div>



      {/* TABLA */}
      <div className="clientes-table">

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((c) => (
              <tr key={c.cliente_id}>
                <td>{c.nombre_cliente}</td>
                <td>{c.apellido_cliente}</td>
                <td>{c.telefono}</td>

                <td>
                  <span className={c.estado === 1 ? "badge-activo" : "badge-inactivo"}>
                    {c.estado === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => setClienteEditar(c)}
                  >
                    Editar cliente
                  </button>
                  <button
                  className="btn-editar"
                  onClick={() => {
                    setClienteActualizar(c);
                    setShowActualizar(true);
                  }}
                >
                  Actualizar medidas
                </button>
              </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* MODAL CREAR */}
      {showCrear && (
        <CrearCliente
          open={showCrear}
          onClose={() => setShowCrear(false)}
          onSuccess={(nuevoCliente) => {
            cargarClientes();
            setShowCrear(false);

            setClienteMedidas(nuevoCliente);
            setShowMedidas(true);
          }}
        />
      )}

      {showActualizar && (
        <ModalActualizarMedidas
          cliente={clienteActualizar}
          onClose={() => setShowActualizar(false)}
        />
      )}

      {/* MODAL EDITAR */}
      {clienteEditar && (
        <EditarCliente
          isOpen={true}
          cliente={clienteEditar}
          onClose={() => setClienteEditar(null)}
          onSuccess={cargarClientes}
        />
      )}

      {/* 🔥 MODAL MEDIDAS */}
      {showMedidas && (
        <ModalMedidas
          cliente={clienteMedidas}
          onClose={() => setShowMedidas(false)}
        />
      )}

    </div>
  );
}

export default Clientes;