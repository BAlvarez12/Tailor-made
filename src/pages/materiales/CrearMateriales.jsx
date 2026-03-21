import { useState, useEffect } from 'react'
import axios from 'axios'
import './CrearMateriales.css'
import { useNavigate, useSearchParams } from 'react-router-dom'

function CrearMaterial() {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  const [form, setForm] = useState({
    nombre_material: '',
    descripcion_material: '',
    categoria_id: '',
    precio_unitario: '',
    referencia_compra: '',
    stock: ''
  })

  const [imagenes, setImagenes] = useState([])
  const [categorias, setCategorias] = useState([])

  // 🔥 CARGAR CATEGORÍAS
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

  // 🔥 SI HAY ID → CARGAR MATERIAL
  useEffect(() => {
    if (id) {
      fetchMaterial()
    }
  }, [id])

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

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleFiles = (e) => {
    setImagenes(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      if (id) {
        // ✏️ EDITAR
        await axios.put(`http://localhost:3000/api/materiales/${id}`, form)
        alert('Material actualizado')
      } else {
        // ➕ CREAR
        const data = new FormData()

        Object.keys(form).forEach(key => {
          data.append(key, form[key])
        })

        for (let i = 0; i < imagenes.length; i++) {
          data.append('imagenes', imagenes[i])
        }

        await axios.post('http://localhost:3000/api/materiales', data)
        alert('Material creado')
      }

      navigate('/home/materiales')

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="form-container">
      <h2>{id ? 'Editar material' : 'Agregar material'}</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {/* NOMBRE */}
        <div className="form-group">
          <label>Nombre</label>
          <input 
            name="nombre_material"
            value={form.nombre_material}
            onChange={handleChange}
          />
        </div>

        {/* CATEGORÍA */}
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

        {/* PRECIO */}
        <div className="form-group">
          <label>Precio</label>
          <input 
            name="precio_unitario"
            value={form.precio_unitario}
            onChange={handleChange}
          />
        </div>

        {/* REFERENCIA */}
        <div className="form-group">
          <label>Referencia</label>
          <input 
            name="referencia_compra"
            value={form.referencia_compra}
            onChange={handleChange}
          />
        </div>

        {/* STOCK */}
        <div className="form-group">
          <label>Stock</label>
          <input 
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {/* IMÁGENES SOLO EN CREAR */}
        {!id && (
          <div className="form-group">
            <label>Imágenes</label>
            <input type="file" multiple onChange={handleFiles} />
          </div>
        )}

        {/* DESCRIPCIÓN */}
        <div className="form-group full-width">
          <label>Descripción</label>
          <textarea 
            name="descripcion_material"
            value={form.descripcion_material}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* BOTÓN */}
        <div className="button-container full-width">
          <button type="submit">
            {id ? 'Actualizar' : 'Guardar'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default CrearMaterial