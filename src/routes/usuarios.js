const express = require('express')
const router = express.Router()
const { obtenerUsuarios } = require('../controller/usuarios/obtenerUsers')
const { crearUsuario } = require('../controller/usuarios/createUsers')

router.get('/obtener', obtenerUsuarios)
router.post('/crear', crearUsuario)


module.exports = router