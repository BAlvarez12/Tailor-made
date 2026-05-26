const express = require('express')
const router = express.Router()

const { requierePermiso } = require('../middleware/permiso')
const { obtenerRoles } = require('../controller/roles/obtenerRoles')
const { obtenerRolPorId } = require('../controller/roles/obtenerRolPorId')
const { crearRol } = require('../controller/roles/crearRol')
const { actualizarRol } = require('../controller/roles/actualizarRol')

router.get('/obtener', obtenerRoles)
router.get('/:id', requierePermiso(['editar_roles', 'asignar_permiso_roles']), obtenerRolPorId)
router.post('/', requierePermiso('crear_roles'), crearRol)
router.put('/:id', requierePermiso(['editar_roles', 'asignar_permiso_roles']), actualizarRol)

module.exports = router
