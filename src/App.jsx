import { useEffect, useState } from 'react'
import AppRouter from './routes/AppRouter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toast.css'
import useTema from './hooks/useTema'

// Posición responsiva: en móvil arriba-centrado (no choca con la barra
// inferior MobileNav), en web arriba-derecha.
function usePosicionToast() {
  const consultar = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
      ? 'top-center'
      : 'top-right'

  const [posicion, setPosicion] = useState(consultar)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 600px)')
    const onChange = () => setPosicion(mql.matches ? 'top-center' : 'top-right')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return posicion
}

function App() {
  const { tema } = useTema()
  const posicion = usePosicionToast()

  return (
    <>
      <AppRouter />
      <ToastContainer
        position={posicion}
        autoClose={2500}
        limit={3}
        stacked
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={tema === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

export default App
