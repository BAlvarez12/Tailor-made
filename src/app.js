require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/roles'))
app.use('/api/prendas', require('./routes/prendas'))

const path = require('path')

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/pedidos', require('./routes/pedidos'))
app.use('/api/materiales', require('./routes/materiales'))

module.exports = app