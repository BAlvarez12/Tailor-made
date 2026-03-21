/* CONFIGURACIÓN ROUTER */
const express = require("express");
const router = express.Router();

/* CONTROLADOR CLIENTES */
const clientesCtrl = require("../../controller/clientes/clientes");

/* OBTENER CLIENTES */
router.get("/", clientesCtrl.getClientes);

/* OBTENER CLIENTE POR ID */
router.get("/:id", clientesCtrl.getClienteById);

/* CREAR CLIENTE */
router.post("/", clientesCtrl.createCliente);

/* ACTUALIZAR CLIENTE */
router.put("/:id", clientesCtrl.updateCliente);

/* DESARCHIVAR CLIENTE */
router.put("/restore/:id", clientesCtrl.restoreCliente);

/* ARCHIVAR CLIENTE */
router.delete("/:id", clientesCtrl.deleteCliente);

module.exports = router;