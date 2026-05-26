const jwt = require('jsonwebtoken')
const { obtenerPermisosUsuario } = require('../services/permisosCache')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Los permisos NO se leen del JWT (puede estar desactualizado si el admin
    // cambió el rol después del login).  Siempre vienen de BD vía cache 60s.
    const permisos = await obtenerPermisosUsuario(decoded.usuario_id)

    req.user = {
      ...decoded,
      permisos: Array.from(permisos),
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

module.exports = auth
