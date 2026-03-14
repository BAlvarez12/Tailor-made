require('dotenv').config()
const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})


app.use('/api/auth', require('./routes/auth'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/roles'))


module.exports = app