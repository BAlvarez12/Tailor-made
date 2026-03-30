exports.getUnidades = (req, res) => {
  res.json({ message: "Lista de unidades" });
};

exports.createUnidad = (req, res) => {
  const { nombre } = req.body;
  res.json({ message: "Unidad creada", nombre });
};