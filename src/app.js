require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const tipoMedidas2Routes = require("./routes/tipo_medidas2");
const app = express();


// 🌐 CONFIGURACIÓN CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// 🧠 MIDDLEWARE
app.use(express.json());


// 🔹 RUTA BASE
app.get('/', (req, res) => {
  res.send('Backend funcionando');
});


// 📁 ARCHIVOS ESTÁTICOS
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// 🔥 RUTAS API (ORDENADAS POR MÓDULO)

// 🔐 AUTH
app.use('/api/auth', require('./routes/auth'));

// 👤 USUARIOS Y ROLES
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/roles', require('./routes/roles'));

// 👕 PRENDAS
app.use('/api/prendas', require('./routes/prendas'));
app.use('/api/tipo-prendas', require('./routes/tipo_prendas'));

// 📦 PEDIDOS
app.use('/api/pedidos', require('./routes/pedidos'));

// 🧵 MATERIALES
app.use('/api/materiales', require('./routes/materiales'));

// 👥 CLIENTES (🔥 EL QUE ACABAMOS DE HACER)
app.use('/api/clientes', require('./routes/clientes'));

// 📏 UNIDADES Y MEDIDAS
app.use('/api/unidades', require('./routes/unidades'));
app.use('/api/unidadesv2', require('./routes/unidades_medida'));
app.use('/api/tipo-medidas', require('./routes/tipo_medidas'));

//archivo temporal de medidas
app.use("/api/tipo_medidas2", tipoMedidas2Routes);


module.exports = app;