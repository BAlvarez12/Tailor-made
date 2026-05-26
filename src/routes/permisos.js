const express = require('express')
const router = express.Router()

const { listarPermisos } = require('../controller/permisos/listarPermisos')

router.get('/', listarPermisos)

module.exports = router
