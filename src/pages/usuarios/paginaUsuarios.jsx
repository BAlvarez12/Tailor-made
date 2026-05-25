import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  obtenerUsuariosService,
  reenviarInvitacionUsuarioService,
} from '../../services/usuarios'
import {
  ESTADO_USUARIO,
  etiquetaEstadoUsuario,
  claseBadgeEstadoUsuario,
} from '../../utils/estadoUsuario'
import Createusuarios from './formularioUsuarios'
import '../../styles/tmListPage.css'
import './paginaUsuarios.css'

const nombreCompletoUsuario = (user) =>
  `${user.nombre_usuario || ''} ${user.apellido_usuario || ''}`.trim()

function PageUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [usuarioEditarId, setUsuarioEditarId] = useState(null)
  const [reenviandoId, setReenviandoId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState(ESTADO_USUARIO.ACTIVO)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await obtenerUsuariosService()
      setUsuarios(Array.isArray(data) ? data : [])
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

  const usuariosFiltrados = useMemo(() => {
    let lista = usuarios

    if (filtroEstado !== null) {
      lista = lista.filter((u) => Number(u.estado) === filtroEstado)
    }

    const texto = busqueda.trim().toLowerCase()
    if (!texto) return lista

    return lista.filter((u) => {
      const nombre = (u.nombre_usuario || '').toLowerCase()
      const apellido = (u.apellido_usuario || '').toLowerCase()
      const completo = nombreCompletoUsuario(u).toLowerCase()
      const usuario = (u.usuario || '').toLowerCase()
      const correo = (u.correo || u.email || '').toLowerCase()

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        completo.includes(texto) ||
        usuario.includes(texto) ||
        correo.includes(texto)
      )
    })
  }, [usuarios, busqueda, filtroEstado])

  const abrirCrearUsuario = () => {
    setUsuarioEditarId(null)
    setOpenModal(true)
  }

  const abrirEditarUsuario = (usuarioId) => {
    setUsuarioEditarId(usuarioId)
    setOpenModal(true)
  }

  const cerrarModal = () => {
    setOpenModal(false)
    setUsuarioEditarId(null)
  }

  const handleReenviarInvitacion = async (usuarioId) => {
    try {
      setReenviandoId(usuarioId)
      const res = await reenviarInvitacionUsuarioService(usuarioId)
      toast.success(res?.message || 'Invitación reenviada correctamente.')
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        'No se pudo reenviar la invitación.'
      toast.error(mensaje)
    } finally {
      setReenviandoId(null)
    }
  }

  return (
    <div className="tm-users">
      <header className="tm-users__header">
        <div>
          <h1>Usuarios</h1>
          <p>Listado de usuarios creados en el sistema.</p>
        </div>

        <div className="search-filter-container">
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </g>
            </svg>

            <input
              type="search"
              className="input"
              placeholder="Buscar por nombre, apellido, usuario o correo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filter-dropdown">
            <button
              type="button"
              className="filter-button"
              title="Filtrar"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 15.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-5.586a1 1 0 00-.293-.707L1.293 8.707A1 1 0 011 8V6z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div className={`filter-menu ${showFilterMenu ? 'active' : ''}`}>
              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === ESTADO_USUARIO.ACTIVO ? 'active' : ''
                }`}
                onClick={() => {
                  setFiltroEstado(ESTADO_USUARIO.ACTIVO)
                  setShowFilterMenu(false)
                }}
              >
                Activos
              </button>

              <button
                type="button"
                className={`filter-option ${filtroEstado === null ? 'active' : ''}`}
                onClick={() => {
                  setFiltroEstado(null)
                  setShowFilterMenu(false)
                }}
              >
                Todos
              </button>

              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === ESTADO_USUARIO.INVITACION ? 'active' : ''
                }`}
                onClick={() => {
                  setFiltroEstado(ESTADO_USUARIO.INVITACION)
                  setShowFilterMenu(false)
                }}
              >
                Invitación enviada
              </button>

              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === ESTADO_USUARIO.INACTIVO ? 'active' : ''
                }`}
                onClick={() => {
                  setFiltroEstado(ESTADO_USUARIO.INACTIVO)
                  setShowFilterMenu(false)
                }}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>

        <div className="tm-users__buttons">
          <button
            type="button"
            className="tm-users__create-btn"
            onClick={abrirCrearUsuario}
          >
            <span>Crear usuario</span>
          </button>
        </div>
      </header>

      <div className="tm-users__card">
        {loading && <p className="tm-users__state">Cargando usuarios...</p>}

        {error && <p className="tm-users__error">{error}</p>}

        {!loading && !error && usuariosFiltrados.length === 0 && (
          <p className="tm-users__state">No hay usuarios para mostrar.</p>
        )}

        {!loading && !error && usuariosFiltrados.length > 0 && (
          <div className="tm-users__table-wrapper">
            <table className="tm-users__table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((user) => (
                  <tr key={user.usuario_id}>
                    <td>{nombreCompletoUsuario(user) || '—'}</td>
                    <td>{user.usuario || '—'}</td>
                    <td>{user.correo || user.email || '—'}</td>
                    <td>{user.nombre_rol || '—'}</td>
                    <td>
                      <span
                        className={`tm-users__badge ${claseBadgeEstadoUsuario(user.estado)}`}
                      >
                        {etiquetaEstadoUsuario(user.estado)}
                      </span>
                    </td>
                    <td>
                      <div className="tm-users__acciones">
                        {Number(user.estado) === ESTADO_USUARIO.INVITACION && (
                          <button
                            type="button"
                            className="tm-users__btn-accion tm-users__btn-accion--invitacion"
                            onClick={() => handleReenviarInvitacion(user.usuario_id)}
                            disabled={reenviandoId === user.usuario_id}
                          >
                            {reenviandoId === user.usuario_id
                              ? 'Enviando...'
                              : 'Reenviar invitación'}
                          </button>
                        )}
                        <button
                          type="button"
                          className="tm-users__btn-accion tm-users__btn-accion--editar"
                          onClick={() => abrirEditarUsuario(user.usuario_id)}
                        >
                          Editar
                        </button>
                      </div>
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
        onClose={cerrarModal}
        onSuccess={() => {
          cerrarModal()
          cargarUsuarios()
        }}
        usuarioEditarId={usuarioEditarId}
      />
    </div>
  )
}

export default PageUsuarios
