const express = require("express");
const router = express.Router();

const { leerClientes } = require("../controller/clientes/leerClientes");
const { crearCliente } = require("../controller/clientes/crearCliente");
const { actualizarCliente } = require("../controller/clientes/actualizarCliente");
const { obtenerClientesActivos } = require("../controller/clientes/obtenerClientesActivos");
const { guardarMedidas } = require('../controller/clientes/guardarMedidas');
const { obtenerMedidasCliente } = require("../controller/clientes/obtenerMedidasCliente");
const { actualizarMedidas } = require('../controller/clientes/actualizarMedidas');


router.get("/", leerClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.get("/activos", obtenerClientesActivos);
router.post('/medidas', guardarMedidas);
//router.get('/medidas/:cliente_prenda_id', obtenerMedidas);
router.put('/medidas', actualizarMedidas);
router.get("/medidas/cliente/:cliente_id", obtenerMedidasCliente);

module.exports = router;