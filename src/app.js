/* CONFIGURACIÓN INICIAL */
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

/* CONFIGURACIÓN CORS */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

/* MIDDLEWARE */
app.use(express.json())

/* RUTA DE PRUEBA */
app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

/* RUTAS */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/roles'))

/* RUTA CLIENTES */
app.use('/api/clientes', require('./routes/clientes/clientes'))

/* RUTA UNIDADES */
app.use('/api/unidades', require('./routes/unidades/unidades'))

/* RUTA TIPOS */
app.use('/api/tipo-medidas', require('./routes/tipo_medidas/tipo_medidas'))

/* EXPORTAR APP */
module.exports = app