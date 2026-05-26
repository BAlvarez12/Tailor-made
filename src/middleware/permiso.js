// Middleware factory: bloquea la ruta si el usuario logueado no tiene el
// permiso especificado.  Lee de `req.user.permisos` (poblado por el
// middleware `auth` desde el JWT).
//
// Uso:
//   router.post('/', requierePermiso('crear_clientes'), crearCliente)
//   router.put('/:id', requierePermiso(['editar_roles', 'asignar_permiso_roles']), ...)

const requierePermiso = (codigo) => {
  const codigos = Array.isArray(codigo) ? codigo : [codigo]

  return (req, res, next) => {
    const permisos = req.user?.permisos || []
    const ok = codigos.some((c) => permisos.includes(c))

    if (!ok) {
      return res.status(403).json({
        message: 'No tienes permiso para realizar esta acción.',
      })
    }

    next()
  }
}

module.exports = { requierePermiso }
