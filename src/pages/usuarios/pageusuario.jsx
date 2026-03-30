import { useEffect, useState } from 'react'
import { obtenerUsuariosService } from '../../services/usuarios'
import Createusuarios from './createusuarios'
import './pageusuario.css'

function PageUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await obtenerUsuariosService()
      setUsuarios(data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  return (
    <div className="tm-users tm-users--usuarios">
      <div className="tm-users__header">
        <div>
          <h1>Usuarios</h1>
          <p>Listado de usuarios creados en el sistema.</p>
        </div>

        <button
          className="tm-users__create-btn"
          onClick={() => setOpenModal(true)}
        >
          <span>Crear usuario</span>
        </button>
      </div>

      <div className="tm-users__card">
        {loading && <p className="tm-users__state">Cargando usuarios...</p>}

        {error && <p className="tm-users__error">{error}</p>}

        {!loading && !error && usuarios.length === 0 && (
          <p className="tm-users__state">No hay usuarios registrados.</p>
        )}

        {!loading && !error && usuarios.length > 0 && (
          <div className="tm-users__table-wrapper">
            <table className="tm-users__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.usuario_id}>
                    <td>{user.usuario_id}</td>
                    <td>
                      {`${user.nombre_usuario || ''} ${user.apellido_usuario || ''}`.trim() || '-'}
                    </td>
                    <td>{user.usuario || '-'}</td>
                    <td>{user.correo || user.email || '-'}</td>
                    <td>{user.nombre_rol || '-'}</td>
                    <td>
                      <span
                        className={`tm-users__badge ${
                          Number(user.estado) === 1 || user.activo
                            ? 'tm-users__badge--active'
                            : 'tm-users__badge--inactive'
                        }`}
                      >
                        {Number(user.estado) === 1 || user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Createusuarios
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={cargarUsuarios}
      />
    </div>
  )
}

export default PageUsuarios