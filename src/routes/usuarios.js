const express = require('express')
const router = express.Router()

const { obtenerUsuarios } = require('../controller/usuarios/obtenerUsuarios')
const { obtenerUsuarioPorId } = require('../controller/usuarios/obtenerusuarioporid')
const { crearUsuario } = require('../controller/usuarios/crearusuario')
const { actualizarUsuario } = require('../controller/usuarios/actualizarusuario')


router.get('/obtener', obtenerUsuarios)
router.get('/obtener/:id', obtenerUsuarioPorId);
router.post('/crear', crearUsuario)
router.put('/actualizar/:id', actualizarUsuario);



module.exports = router