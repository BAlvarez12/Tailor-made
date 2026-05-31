require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')

const logRequests = require('./middleware/logRequests')
const auth = require('./middleware/auth')

if (!process.env.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN no está definido en .env')
}

const corsOrigins = process.env.CORS_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const app = express()

// Headers de seguridad estándar (XSS, content-type sniffing, clickjacking, etc.).
// Relajamos crossOriginResourcePolicy para que el frontend (otro puerto en dev)
// pueda cargar imágenes desde /uploads sin bloqueo CORP.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use(express.json())
app.use(logRequests)

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Rate limit para endpoints sensibles de /api/auth (brute-force / abuso de email).
// Independiente del lockout por usuario que ya existe en login_intentos.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
})

const recuperacionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes. Espera una hora antes de reintentar.' },
})

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'tailor-made-api',
    auth: { login: true, activarCuenta: true },
  })
})

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

// Rutas públicas (sin token) — con rate limit en endpoints sensibles
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth/olvide-contrasena/solicitar', recuperacionLimiter)
app.use('/api/auth/olvide-contrasena/reenviar', recuperacionLimiter)
app.use('/api/auth/olvide-contrasena/verificar-enlace', loginLimiter)
app.use('/api/auth/olvide-contrasena/restablecer', loginLimiter)
app.use('/api/auth', require('./routes/auth'))

// Protección global: todas las rutas /api/* registradas debajo requieren JWT válido
app.use('/api', auth)

app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/roles', require('./routes/roles'))
app.use('/api/permisos', require('./routes/permisos'))
app.use('/api/busqueda', require('./routes/busqueda'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/prendas', require('./routes/prendas'))
app.use('/api/tipo-prendas', require('./routes/tipo_prendas'))
app.use('/api/pedidos', require('./routes/pedidos'))
app.use('/api/materiales', require('./routes/materiales'))
app.use('/api/clientes', require('./routes/clientes'))
app.use('/api/cotizaciones', require('./routes/cotizaciones'))
app.use('/api/pagos', require('./routes/pagos'))
app.use('/api/unidades', require('./routes/unidades'))
app.use('/api/unidadesv2', require('./routes/unidades_medida'))
app.use('/api/tipo-medidas', require('./routes/tipo_medidas'))
app.use('/api/tipo_medidas2', require('./routes/tipo_medidas2'))

module.exports = app
