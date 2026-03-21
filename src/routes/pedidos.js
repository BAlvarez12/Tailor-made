const express = require('express')
const router = express.Router()

// Controllers
const createPedido = require('../controller/pedidos/createPedido')
const getPedidos = require('../controller/pedidos/getPedidos')
const deletePedido = require('../controller/pedidos/deletePedido')
const updatePedido = require('../controller/pedidos/updatePedido')
const getPedidoById = require('../controller/pedidos/getPedidoById')

// CRUD
router.post('/', createPedido)
router.get('/', getPedidos)
router.delete('/:id', deletePedido)
router.put('/:id', updatePedido)
router.get('/:id', getPedidoById)

module.exports = router



