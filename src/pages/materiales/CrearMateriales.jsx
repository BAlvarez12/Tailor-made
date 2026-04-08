import { useState, useEffect } from 'react'
import axios from 'axios'
import './CrearMateriales.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPortal } from 'react-dom'

function CrearMaterial({ open, idProp, onClose }) {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const id = idProp || searchParams.get('id')

  const initialForm = {
    nombre_material: '',
    descripcion_material: '',
    categoria_id: '',
    precio_unitario: '',
    referencia_compra: '',
    stock: ''
  }

  const [form, setForm] = useState(initialForm)
  const [imagenes, setImagenes] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materiales/categorias')
      setCategorias(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  // 🔥 RESET FORM CUANDO ABRES EN MODO CREAR
  useEffect(() => {
    if (open && !id) {
      setForm(initialForm)
      setImagenes([])
    }
  }, [open, id])

  // 🔥 CARGAR DATOS SI ES EDICIÓN
  useEffect(() => {
    if (id && open) fetchMaterial()
  }, [id, open])

  const fetchMaterial = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materiales')
      const mat = res.data.find(m => m.material_id == id)

      if (!mat) return

      setForm({
        nombre_material: mat.nombre_material || '',
        descripcion_material: mat.descripcion_material || '',
        categoria_id: mat.categoria_id || '',
        precio_unitario: mat.precio_unitario || '',
        referencia_compra: mat.referencia_compra || '',
        stock: mat.stock || ''
      })

    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFiles = (e) => {
    setImagenes(e.target.files)
  }

  const resetForm = () => {
    setForm(initialForm)
    setImagenes([])
  }

  const handleClose = () => {
    resetForm()
    if (onClose) onClose()
    else navigate('/home/materiales')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Sesión expirada, inicia sesión nuevamente')
        return
      }

      if (id) {
        await axios.put(
          `http://localhost:3000/api/materiales/${id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        alert('Material actualizado')

      } else {
        const data = new FormData()

        Object.keys(form).forEach(key => {
          data.append(key, form[key])
        })

        for (let i = 0; i < imagenes.length; i++) {
          data.append('imagenes', imagenes[i])
        }

        await axios.post(
          'http://localhost:3000/api/materiales',
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        alert('Material creado')
      }

      handleClose()

    } catch (error) {
      console.error(error)
      alert(error.response?.data?.error || 'Error al guardar material')
    }
  }

  if (!open) return null

  return createPortal(
    <div className="materiales-overlay" onClick={handleClose}>
      <div className="materiales-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{id ? 'Editar material' : 'Agregar material'}</h2>
          <button className="btn-cerrar" onClick={handleClose}>✕</button>
        </div>

        <div className="modal-body">

          <form 
            onSubmit={handleSubmit} 
            className={`form-grid ${categorias.length === 0 ? 'hidden-form' : ''}`}
          >

            <div className="form-group">
              <label>Nombre</label>
              <input 
                name="nombre_material"
                value={form.nombre_material}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select 
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.categoria_id} value={cat.categoria_id}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio</label>
              <input 
                name="precio_unitario"
                value={form.precio_unitario}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Referencia</label>
              <input 
                name="referencia_compra"
                value={form.referencia_compra}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input 
                name="stock"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            {!id && (
              <div className="form-group">
                <label>Imágenes</label>
                <input type="file" multiple onChange={handleFiles} />
              </div>
            )}

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea 
                name="descripcion_material"
                value={form.descripcion_material}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="button-container full-width">
              <button type="submit">
                {id ? 'Actualizar' : 'Guardar'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>,
    document.body
  )
}

export default CrearMaterial