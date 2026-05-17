const { obtenerPlanCompleto } = require("./pagosQueries");

const obtenerPlanPagoPorId = async (req, res) => {
  try {
    const planPagoId = Number(req.params.id);

    if (!planPagoId || Number.isNaN(planPagoId)) {
      return res.status(400).json({ message: "Id de plan inválido" });
    }

    const plan = await obtenerPlanCompleto(planPagoId);

    if (!plan) {
      return res.status(404).json({ message: "Plan de pago no encontrado" });
    }

    return res.status(200).json(plan);
  } catch (error) {
    console.error("Error en obtenerPlanPagoPorId:", error);
    return res.status(500).json({
      message: "Error al obtener el plan de pago",
      error: error.message,
    });
  }
};

module.exports = { obtenerPlanPagoPorId };
