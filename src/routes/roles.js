const express = require('express')
const router = express.Router()
const { obtenerRoles } = require('../controller/roles/obtenerRoles')

router.get('/obtener', obtenerRoles)

module.exports = router