const express = require("express");
const router = express.Router();

const { requierePermiso } = require("../middleware/permiso");
const { leerClientes } = require("../controller/clientes/leerClientes");
const { crearCliente } = require("../controller/clientes/crearCliente");
const { actualizarCliente } = require("../controller/clientes/actualizarCliente");
const { obtenerClientesActivos } = require("../controller/clientes/obtenerClientesActivos");
const { guardarMedidas } = require("../controller/clientes/guardarMedidas");
const { obtenerMedidasCliente } = require("../controller/clientes/obtenerMedidasCliente");
const { actualizarMedidas } = require("../controller/clientes/actualizarMedidas");
const { obtenerClientePorId } = require("../controller/clientes/obtenerClientePorId");

router.get("/", leerClientes);
router.post("/", requierePermiso("crear_clientes"), crearCliente);
router.get("/activos", obtenerClientesActivos);

router.post("/medidas", requierePermiso("actualizar_medidas_cliente"), guardarMedidas);
router.put("/medidas", requierePermiso("actualizar_medidas_cliente"), actualizarMedidas);
router.get("/medidas/cliente/:cliente_id", obtenerMedidasCliente);

router.get("/:id/detalle", obtenerClientePorId);
router.put("/:id", requierePermiso("editar_clientes"), actualizarCliente);

module.exports = router;
