import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Materiales.css'

function Materiales() {

  const [materiales, setMateriales] = useState([])
  const navigate = useNavigate()

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

  // 🗑️ ELIMINAR
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar material?')) return

    try {
      await axios.delete(`http://localhost:3000/api/materiales/${id}`)
      fetchMateriales()
    } catch (error) {
      console.error(error)
    }
  }

  // ✏️ EDITAR → REDIRIGE
  const handleEdit = (id) => {
    navigate(`/home/materiales/crear?id=${id}`)
  }

  return (
    <div className="materiales-container">

      <div className="materiales-header">
        <h2 className="materiales-title">Inventario de materiales</h2>

        <button 
          className="materiales-btn"
          onClick={() => navigate('/home/materiales/crear')}
        >
          + Agregar material
        </button>
      </div>

      <div className="materiales-grid">
        {materiales.map(mat => (
          <div key={mat.material_id} className="materiales-card">

            <img 
              src={`http://localhost:3000/uploads/materiales/${mat.url_img}`} 
              alt={mat.nombre_material}
              className="materiales-img"
            />

            <h3>{mat.nombre_material}</h3>

            <p><strong>Categoría:</strong> {mat.nombre_categoria}</p>

            <p>
              <strong>Precio:</strong> {
                new Intl.NumberFormat('es-GT', {
                  style: 'currency',
                  currency: 'GTQ'
                }).format(Number(mat.precio_unitario))
              }
            </p>

            <p><strong>Stock:</strong> {mat.stock}</p>

            {/* 🔥 BOTONES */}
            <div className="materiales-actions">
              <button 
                className="btn-editar"
                onClick={() => handleEdit(mat.material_id)}
              >
                Editar
              </button>

              <button 
                className="btn-eliminar"
                onClick={() => handleDelete(mat.material_id)}
              >
                Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Materiales