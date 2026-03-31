const db = require('../../config/db');

const actualizarMedidas = async (req, res) => {
  try {
    const { medidas } = req.body;

    for (const m of medidas) {
      await db.query(
        `CALL sp_actualizarMedidaCliente(?, ?)`,
        [
          m.cliente_medida_id,
          m.valor
        ]
      );
    }

    res.json({ message: 'Medidas actualizadas' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando medidas' });
  }
};

module.exports = { actualizarMedidas };