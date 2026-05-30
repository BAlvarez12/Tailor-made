/**
 * Middleware que garantiza que la respuesta no se envíe antes de que pase
 * un mínimo de tiempo (en milisegundos). Sirve como defensa contra
 * "timing attacks": si el endpoint responde igual de rápido cuando el
 * usuario no existe vs cuando existe pero la contraseña está mal, un
 * atacante no puede inferir nada del tiempo de respuesta.
 *
 * Funcionamiento: registra el tiempo de inicio, intercepta res.json() /
 * res.send() y, si la respuesta está lista antes del mínimo, retrasa el
 * envío hasta cumplir ese mínimo.
 *
 * Uso:
 *   router.post('/login', tiempoRespuestaMinimo(2000), loginController);
 */
const tiempoRespuestaMinimo = (minimoMs) => (req, res, next) => {
  const inicio = Date.now();

  const enviarConRetraso = (fnOriginal) =>
    function (...args) {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, minimoMs - transcurrido);

      if (restante === 0) {
        return fnOriginal.apply(this, args);
      }

      setTimeout(() => fnOriginal.apply(this, args), restante);
      return this;
    };

  const jsonOriginal = res.json.bind(res);
  const sendOriginal = res.send.bind(res);

  res.json = enviarConRetraso(jsonOriginal);
  res.send = enviarConRetraso(sendOriginal);

  next();
};

module.exports = { tiempoRespuestaMinimo };
