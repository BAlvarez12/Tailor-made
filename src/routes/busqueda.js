const express = require('express')
const router = express.Router()

const { busquedaGlobal } = require('../controller/busqueda/busquedaGlobal')

router.get('/', busquedaGlobal)

module.exports = router
