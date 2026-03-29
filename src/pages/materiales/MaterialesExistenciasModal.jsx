import { useEffect, useState } from 'react'
import axios from 'axios'
import './MaterialesExistencias.css'

function MaterialesExistenciasModal({ open, onClose }) {

  const [materiales, setMateriales] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (open) {
      fetchMateriales()
    }
  }, [open])

  const fetchMateriales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materiales')

      const data = res.data.map(m => ({
        ...m,
        nuevoStock: m.stock
      }))

      setMateriales(data)
    } catch (error) {
      console.error(error)
    }
  }

  // 🔍 FILTRO
  const materialesFiltrados = materiales.filter(m =>
    m.nombre_material.toLowerCase().includes(busqueda.toLowerCase())
  )

  const aumentar = (index) => {
    const nuevos = [...materialesFiltrados]
    nuevos[index].nuevoStock++
    
    actualizarGlobal(nuevos[index])
  }

  const disminuir = (index) => {
    const nuevos = [...materialesFiltrados]
    if (nuevos[index].nuevoStock > 0) {
      nuevos[index].nuevoStock--
    }

    actualizarGlobal(nuevos[index])
  }

  // 🔥 ACTUALIZA EL ARRAY ORIGINAL
  const actualizarGlobal = (materialActualizado) => {
    const nuevos = materiales.map(m =>
      m.material_id === materialActualizado.material_id
        ? materialActualizado
        : m
    )
    setMateriales(nuevos)
  }

  // 🔥 GUARDAR TODO
  const guardarCambios = async () => {
  try {
    const cambios = materiales.filter(m => m.nuevoStock !== m.stock)

    if (cambios.length === 0) {
      alert('No hay cambios')
      return
    }

    const token = localStorage.getItem('token')

      await Promise.all(
        cambios.map(mat => {
          const diferencia = mat.nuevoStock - mat.stock

          return axios.post(
            'http://localhost:3000/api/materiales/movimientos-existencias',
            {
              material_id: mat.material_id,
              cantidad: diferencia
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        })
      )

    alert('Cambios guardados correctamente')
    fetchMateriales()

  } catch (error) {
    console.error(error)
    alert('Error al guardar cambios')
  }
}

  if (!open) return null

  return (
    <div className="materiales-existencias-overlay" onClick={onClose}>
      <div className="materiales-existencias-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <h2>Agregar Existencias</h2>
          <button className="btn-cerrar" onClick={onClose}>✕</button>
        </div>

        {/* 🔍 BUSCADOR */}
        <div className="buscador-container">
          <input
            type="text"
            placeholder="Buscar material..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador-input"
          />
        </div>

        {/* BODY */}
        <div className="modal-body">
          <div className="tabla-wrapper">
            <table className="tabla-existencias">

              <thead>
                <tr>
                  <th>Material</th>
                  <th>Existencia actual</th>
                  <th>Nueva existencia</th>
                </tr>
              </thead>

              <tbody>
                {materialesFiltrados.map((mat, index) => (
                  <tr key={mat.material_id}>

                    <td>{mat.nombre_material}</td>

                    <td>{mat.stock}</td>

                    <td>
                      <button 
                        className="btn-control"
                        onClick={() => disminuir(index)}
                      >
                        -
                      </button>

                      <span className="stock-value">
                        {mat.nuevoStock}
                      </span>

                      <button 
                        className="btn-control"
                        onClick={() => aumentar(index)}
                      >
                        +
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* 🔥 FOOTER */}
        <div className="footer-acciones">
          <button className="btn-guardar-global" onClick={guardarCambios}>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  )
}

export default MaterialesExistenciasModal