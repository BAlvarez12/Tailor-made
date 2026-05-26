// Cache de permisos por usuario con TTL corto.
//
// Objetivo: validar permisos contra BD en cada request (tiempo real), sin
// pagar una consulta SQL en cada llamada al API.
//
// Funcionamiento:
//   - Primera vez que un usuario hace request → consulta BD y cachea por 60s.
//   - Requests siguientes dentro de la ventana → leen del cache (sin query).
//   - Cuando un admin cambia los permisos de un rol o el rol de un usuario,
//     el controlador llama a invalidarTodo() / invalidarUsuario() y la
//     próxima request lee fresco de BD.
//
// El TTL de 60s es el "peor caso" de inconsistencia si por alguna razón se
// olvida invalidar.  Para tiempo real garantizado, llamar a las funciones
// de invalidación después de cualquier mutación de roles o usuarios.

const pool = require('../config/db')

const TTL_MS = 60 * 1000
const cache = new Map() // usuario_id -> { permisos: Set<string>, expira: number }

const obtenerPermisosDeBD = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT p.nombre_permiso
       FROM usuarios u
       JOIN permisos_rol pr ON pr.rol_id = u.rol_id
       JOIN permisos p ON p.permiso_id = pr.permiso_id
      WHERE u.usuario_id = ?`,
    [usuarioId]
  )
  return new Set(rows.map((r) => r.nombre_permiso))
}

const obtenerPermisosUsuario = async (usuarioId) => {
  const ahora = Date.now()
  const cached = cache.get(usuarioId)

  if (cached && cached.expira > ahora) {
    return cached.permisos
  }

  const permisos = await obtenerPermisosDeBD(usuarioId)
  cache.set(usuarioId, { permisos, expira: ahora + TTL_MS })
  return permisos
}

const invalidarUsuario = (usuarioId) => {
  cache.delete(Number(usuarioId))
}

const invalidarTodo = () => {
  cache.clear()
}

module.exports = {
  obtenerPermisosUsuario,
  invalidarUsuario,
  invalidarTodo,
}
