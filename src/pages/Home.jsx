import './Home.css'

function Home() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}

  return (
    <div className="tm-home">
      <div className="tm-home__header">
        <span className="tm-home__eyebrow">Panel principal</span>
        <h1>Bienvenido, {usuario.nombre || usuario.usuario || 'Usuario'}</h1>
        <p>Esta será tu pantalla principal para moverte por el sistema.</p>
      </div>

      <section className="tm-home__grid">
        <article className="tm-home__card">
          <h3>Clientes</h3>
          <p>Administra la información general de tus clientes.</p>
        </article>

        <article className="tm-home__card">
          <h3>Cotizaciones</h3>
          <p>Consulta, crea y da seguimiento a cotizaciones.</p>
        </article>

        <article className="tm-home__card">
          <h3>Pedidos</h3>
          <p>Visualiza el avance de trabajos y pedidos pendientes.</p>
        </article>

        <article className="tm-home__card">
          <h3>Materiales</h3>
          <p>Controla insumos, materiales y disponibilidad.</p>
        </article>
      </section>
    </div>
  )
}

export default Home