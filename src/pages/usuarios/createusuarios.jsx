import { useEffect, useState } from 'react'
import { crearUsuarioService } from '../../services/usuarios/usuarios'
import { obtenerRolesService } from '../../services/roles'
import './createusuarios.css'

function Createusuarios({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    usuario: '',
    password: '',
    email: '',
    estado: 1,
    rol_id: '',
  })

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setForm({
      nombre_usuario: '',
      apellido_usuario: '',
      usuario: '',
      password: '',
      email: '',
      estado: 1,
      rol_id: '',
    })
    setError('')
  }

  const handleClose = () => {
    if (loading) return
    resetForm()
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) setError('')
  }

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setLoadingRoles(true)
        setError('')

        const data = await obtenerRolesService()
        setRoles(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setRoles([])
        setError('No se pudieron cargar los roles.')
      } finally {
        setLoadingRoles(false)
      }
    }

    if (isOpen) {
      cargarRoles()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.nombre_usuario.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    if (!form.apellido_usuario.trim()) {
      setError('El apellido es obligatorio.')
      return
    }

    if (!form.usuario.trim()) {
      setError('El usuario es obligatorio.')
      return
    }

    if (!form.password.trim()) {
      setError('La contraseña es obligatoria.')
      return
    }

    if (!form.email.trim()) {
      setError('El correo es obligatorio.')
      return
    }

    if (!form.rol_id) {
      setError('Debe seleccionar un rol.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const payload = {
        ...form,
        estado: Number(form.estado),
        rol_id: Number(form.rol_id),
      }

      await crearUsuarioService(payload)

      if (onSuccess) {
        await onSuccess()
      }

      resetForm()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'No se pudo crear el usuario.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="tm-modal-overlay" onClick={handleClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="tm-modal__loading-screen">
            <div className="tm-modal__loader"></div>
            <p>Creando usuario...</p>
          </div>
        )}

        <div className="tm-modal__header">
          <h2>Crear usuario</h2>
          <button
            type="button"
            className="tm-modal__close"
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form className={`tm-modal__form ${loading ? 'tm-modal__form--disabled' : ''}`} onSubmit={handleSubmit}>
          {error && <p className="tm-modal__error">{error}</p>}

          <div className="tm-modal__grid">
            <div className="tm-modal__field">
              <label htmlFor="nombre_usuario">Nombre</label>
              <input
                id="nombre_usuario"
                type="text"
                name="nombre_usuario"
                value={form.nombre_usuario}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                disabled={loading}
              />
            </div>

            <div className="tm-modal__field">
              <label htmlFor="apellido_usuario">Apellido</label>
              <input
                id="apellido_usuario"
                type="text"
                name="apellido_usuario"
                value={form.apellido_usuario}
                onChange={handleChange}
                placeholder="Ingrese el apellido"
                disabled={loading}
              />
            </div>

            <div className="tm-modal__field">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                placeholder="Ingrese el usuario"
                disabled={loading}
              />
            </div>

            <div className="tm-modal__field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingrese la contraseña"
                disabled={loading}
              />
            </div>

            <div className="tm-modal__field">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ingrese el correo"
                disabled={loading}
              />
            </div>

            <div className="tm-modal__field">
              <label htmlFor="rol_id">Rol</label>
              <select
                id="rol_id"
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                disabled={loading || loadingRoles}
              >
                <option value="">
                  {loadingRoles ? 'Cargando roles...' : 'Seleccione un rol'}
                </option>

                {roles.map((rol) => (
                  <option
                    key={rol.rol_id || rol.id}
                    value={rol.rol_id || rol.id}
                  >
                    {rol.nombre_rol || rol.nombre || rol.rol}
                  </option>
                ))}
              </select>
            </div>

            <div className="tm-modal__field">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                disabled={loading}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="tm-modal__actions">
            <button
              type="button"
              className="tm-modal__btn tm-modal__btn--secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="tm-modal__btn tm-modal__btn--primary"
              disabled={loading || loadingRoles}
            >
              {loading ? 'Guardando...' : 'Guardar usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Createusuarios