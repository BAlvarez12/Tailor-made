import { useEffect, useState } from 'react'
import CrearPedido from './CrearPedido'
import './Pedidos.css'

function Pedidos() {
  const [vista, setVista] = useState('lista')
  const [pedidos, setPedidos] = useState([])
  const [pedidoEditar, setPedidoEditar] = useState(null)

  const obtenerPedidos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/pedidos')
      const data = await res.json()
      setPedidos(data)
    } catch (error) {
      console.error('Error cargando pedidos:', error)
    }
  }

  const eliminarPedido = async (id) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este pedido?')
    if (!confirmar) return

    try {
      await fetch(`http://localhost:3000/api/pedidos/${id}`, {
        method: 'DELETE'
      })

      obtenerPedidos()
    } catch (error) {
      console.error('Error eliminando pedido:', error)
    }
  }

  useEffect(() => {
    if (vista === 'lista') {
      obtenerPedidos()
    }
  }, [vista])

  return (
    <div className="pedidos-container">

      {vista === 'lista' && (
        <>
          <div className="pedidos-header">
            <h1>Pedidos</h1>

            <button
              className="btn btn-primary px-4"
              onClick={() => {
                setPedidoEditar(null)
                setVista('crear')
              }}
            >
              + Crear pedido
            </button>
          </div>

          <div className="pedidos-card">
            <table className="table table-hover pedidos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Prenda</th>
                  <th>Fecha</th>
                  <th>Notas</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map(p => (
                  <tr key={p.pedido_id}>
                    <td>{p.pedido_id}</td>
                    <td>{p.cliente}</td>
                    <td>{p.nombre_prenda}</td>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td>{p.notas}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-edit me-2"
                        onClick={() => {
                          setPedidoEditar(p)
                          setVista('crear')
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => eliminarPedido(p.pedido_id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}

      {vista === 'crear' && (
        <>
          <button
            className="btn btn-secondary mb-3"
            onClick={() => {
              setVista('lista')
              setPedidoEditar(null)
            }}
          >
            ← Volver
          </button>

          <CrearPedido
            pedidoEditar={pedidoEditar}
            onGuardar={() => {
              setVista('lista')
              setPedidoEditar(null)
              obtenerPedidos()
            }}
          />
        </>
      )}

    </div>
  )
}

export default Pedidos