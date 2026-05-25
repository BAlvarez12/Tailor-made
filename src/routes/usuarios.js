const express = require('express')
const router = express.Router()

const { obtenerUsuarios } = require('../controller/usuarios/obtenerUsuarios')
const { obtenerUsuarioPorId } = require('../controller/usuarios/obtenerusuarioporid')
const { crearUsuario } = require('../controller/usuarios/crearusuario')
const { actualizarUsuario } = require('../controller/usuarios/actualizarusuario')
const { reenviarInvitacionUsuario } = require('../controller/usuarios/reenviarInvitacion')


router.get('/obtener', obtenerUsuarios)
router.get('/obtener/:id', obtenerUsuarioPorId);
router.post('/crear', crearUsuario)
router.put('/actualizar/:id', actualizarUsuario);
router.post('/reenviar-invitacion/:id', reenviarInvitacionUsuario);



module.exports = router