import AppRouter from './routes/AppRouter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTema from './hooks/useTema'

function App() {
  const { tema } = useTema()
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme={tema === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

export default App