const express = require('express')
const router = express.Router()

const { requierePermiso } = require('../middleware/permiso')
const { obtenerUsuarios } = require('../controller/usuarios/obtenerUsuarios')
const { obtenerUsuarioPorId } = require('../controller/usuarios/obtenerusuarioporid')
const { crearUsuario } = require('../controller/usuarios/crearusuario')
const { actualizarUsuario } = require('../controller/usuarios/actualizarusuario')
const { reenviarInvitacionUsuario } = require('../controller/usuarios/reenviarInvitacion')
const { reiniciarPasswordUsuario } = require('../controller/usuarios/reiniciarPasswordUsuario')
const {
  obtenerMiCuenta,
  actualizarMiPerfil,
  cambiarMiPassword,
} = require('../controller/usuarios/miCuenta')

// Mi cuenta · cualquier usuario autenticado puede gestionar su propio perfil
router.get('/me', obtenerMiCuenta)
router.put('/me/perfil', actualizarMiPerfil)
router.put('/me/password', cambiarMiPassword)

router.get('/obtener', obtenerUsuarios)
router.get('/obtener/:id', obtenerUsuarioPorId)
router.post('/crear', requierePermiso('crear_usuarios'), crearUsuario)
router.put('/actualizar/:id', requierePermiso('editar_usuarios'), actualizarUsuario)
router.post('/reenviar-invitacion/:id', requierePermiso('editar_usuarios'), reenviarInvitacionUsuario)
router.post('/reiniciar-password/:id', requierePermiso('editar_usuarios'), reiniciarPasswordUsuario)

module.exports = router
