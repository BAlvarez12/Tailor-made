import { useEffect, useState } from 'react'
import axios from 'axios'
import './Materiales.css'
import logo from '../../assets/logo-tailor-made.png'
import MaterialesExistenciasModal from './MaterialesExistenciasModal'
import CrearMaterial from './CrearMateriales'

function Materiales() {

  const [materiales, setMateriales] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const [mostrarModalExistencias, setMostrarModalExistencias] = useState(false)
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false)
  const [materialEditarId, setMaterialEditarId] = useState(null)

  const abrirModalExistencias = () => setMostrarModalExistencias(true)
  const cerrarModalExistencias = () => setMostrarModalExistencias(false)

  useEffect(() => {
    fetchMateriales()
  }, [])

  const fetchMateriales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materiales')
      setMateriales(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar material?')) return

    try {
      await axios.delete(`http://localhost:3000/api/materiales/${id}`)
      fetchMateriales()
    } catch (error) {
      console.error(error)
    }
  }

  const materialesFiltrados = materiales.filter(m =>
    m.nombre_material.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="materiales-container">

      {/* HEADER */}
      <div className="materiales-header">
        <div>
          <h2 className="materiales-title">Materiales</h2>
          <p className="materiales-subtitle">Listado de materiales</p>
        </div>

        <div className="materiales-header-actions">
          <button onClick={abrirModalExistencias}>
            + Existencia
          </button>

          <button
            onClick={() => {
              setMaterialEditarId(null)
              setMostrarModalCrear(true)
            }}
          >
            + Material
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="materiales-search">
        <input
          type="text"
          placeholder="Buscar 🪡"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="materiales-table-container">
        <table className="materiales-table">

          <thead>
            <tr>
              <th>Material</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Existencia</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {materialesFiltrados.map(mat => (
              <tr key={mat.material_id}>

                <td className="material-info">
                  {mat.url_img ? (
                    <img
                      src={`http://localhost:3000/uploads/materiales/${mat.url_img}`}
                      alt=""
                    />
                  ) : (
                    <img src={logo} alt="" />
                  )}

                  <span>{mat.nombre_material}</span>
                </td>

                <td>{mat.nombre_categoria}</td>

                <td>
                  Q {Number(mat.precio_unitario).toFixed(2)}
                </td>

                <td>
                  <span className="badge-stock">
                    {mat.stock}
                  </span>
                </td>

                <td>
                  <div className="acciones">

                    <button
                      className="btn-accion editar"
                      onClick={() => {
                        setMaterialEditarId(mat.material_id)
                        setMostrarModalCrear(true)
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-accion eliminar"
                      onClick={() => handleDelete(mat.material_id)}
                    >
                      Eliminar
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODALES */}
      <MaterialesExistenciasModal
        open={mostrarModalExistencias}
        onClose={cerrarModalExistencias}
      />

      <CrearMaterial
        open={mostrarModalCrear}
        idProp={materialEditarId}
        onClose={() => {
          setMostrarModalCrear(false)
          fetchMateriales()
        }}
      />

    </div>
  )
}

export default Materiales