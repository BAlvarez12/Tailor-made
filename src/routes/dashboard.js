const express = require('express')
const router = express.Router()

const { obtenerDashboard } = require('../controller/dashboard/obtenerDashboard')

router.get('/', obtenerDashboard)

module.exports = router
