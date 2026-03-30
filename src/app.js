require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()


// MIDDLEWARES
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json())


// TEST ROUTE

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})


// STATIC FILES

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


// ROUTES

app.use('/api/auth', require('./routes/auth'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/roles'))
app.use('/api/prendas', require('./routes/prendas'))
app.use('/api/pedidos', require('./routes/pedidos'))
app.use('/api/materiales', require('./routes/materiales'))
app.use('/api/clientes', require('./routes/clientes'))


app.use('/api/unidades', require('./routes/unidades'))
app.use('/api/unidades-medida', require('./routes/unidades_medida'))
app.use('/api/unidades_medida', require('./routes/unidades_medida'))

app.use('/api/tipo-medidas', require('./routes/tipo_medidas'))
app.use('/api/tipo-prendas', require('./routes/tipo_prendas'))

module.exports = app