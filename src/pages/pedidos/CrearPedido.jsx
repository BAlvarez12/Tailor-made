import { useState, useEffect } from 'react'
import './CrearPedido.css'

function CrearPedido({ pedidoEditar, onGuardar }) {

  const [formData, setFormData] = useState({
    cliente_id: '',
    prenda_id: '',
    notas: ''
  })

  const [imagen, setImagen] = useState(null)
  const [medidas, setMedidas] = useState([])
  const [tipoPrenda, setTipoPrenda] = useState('')
  const [medidasValores, setMedidasValores] = useState({})

  // CARGAR PEDIDO COMPLETO DESDE BACKEND
  useEffect(() => {
    const cargarPedido = async () => {
      if (!pedidoEditar) return

      try {
        const res = await fetch(`http://localhost:3000/api/pedidos/${pedidoEditar.pedido_id}`)
        const data = await res.json()

        setFormData({
          cliente_id: data.cliente_id,
          prenda_id: data.prenda_id,
          notas: data.notas
        })

        // IMPORTANTE: usar la función corregida
        await handlePrendaChange(data.prenda_id)

        // cargar valores de medidas
        const valores = {}
        data.medidas.forEach(m => {
          valores[m.tipo_medida_id] = m.valor
        })

        setMedidasValores(valores)

      } catch (error) {
        console.error('Error cargando pedido:', error)
      }
    }

    cargarPedido()
  }, [pedidoEditar])

  // CORREGIDO: TODO CENTRALIZADO AQUÍ
  const handlePrendaChange = async (prendaId) => {
    setTipoPrenda(prendaId)
    setFormData(prev => ({ ...prev, prenda_id: prendaId }))

    if (!prendaId) {
      setMedidas([])
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/prendas/${prendaId}/medidas`)
      const data = await res.json()

      console.log('MEDIDAS:', data)

      setMedidas(data)
    } catch (error) {
      console.error('Error cargando medidas:', error)
    }
  }

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.prenda_id) {
      alert('Selecciona una prenda')
      return
    }

    const medidasArray = Object.keys(medidasValores).map(id => ({
      tipo_medida_id: Number(id),
      valor: medidasValores[id]
    }))

    if (medidasArray.length === 0) {
      alert('Ingresa al menos una medida')
      return
    }

    try {
      if (!pedidoEditar && imagen) {
        const form = new FormData()
        form.append('prenda_id', formData.prenda_id)
        form.append('imagen', imagen)

        await fetch('http://localhost:3000/api/prendas/imagen', {
          method: 'POST',
          body: form
        })
      }

      const url = pedidoEditar
        ? `http://localhost:3000/api/pedidos/${pedidoEditar.pedido_id}`
        : 'http://localhost:3000/api/pedidos'

      const method = pedidoEditar ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cliente_id: formData.cliente_id,
          prenda_id: formData.prenda_id,
          notas: formData.notas,
          medidas: medidasArray
        })
      })

      alert(pedidoEditar ? 'Pedido actualizado' : 'Pedido creado')

      if (onGuardar) onGuardar()

    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="crear-pedido container mt-4">
      <h2 className="mb-4">
        {pedidoEditar ? 'Editar Pedido' : 'Crear Pedido'}
      </h2>

      <div className="card p-4 shadow-sm">
        <form onSubmit={handleSubmit}>

          <h5 className="mb-3">Datos generales</h5>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Cliente</label>
              <input
                type="text"
                className="form-control"
                value={formData.cliente_id}
                onChange={(e) =>
                  setFormData({ ...formData, cliente_id: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Tipo de prenda</label>
              <select
                className="form-select"
                value={tipoPrenda}
                onChange={(e) => handlePrendaChange(e.target.value)}
              >
                <option value="">Seleccionar prenda</option>
                <option value="1">Camisa</option>
                <option value="2">Pantalón</option>
                <option value="3">Vestido</option>
                <option value="4">Blusa</option>
                <option value="5">Playera</option>
                <option value="6">Pantaloneta</option>
              </select>
            </div>
          </div>

          <h5 className="mb-3 mt-4">Medidas</h5>

          <div className="row g-3">
            {medidas.map((medida) => (
              <div className="col-md-3" key={medida.tipo_medida_id}>
                <label className="form-label">
                  {medida.nombre_tipo_medida}
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={medidasValores[medida.tipo_medida_id] || ''}
                  onChange={(e) =>
                    setMedidasValores(prev => ({
                      ...prev,
                      [medida.tipo_medida_id]: Number(e.target.value)
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <h5 className="mb-3 mt-4">Imagen de referencia</h5>

          {pedidoEditar && pedidoEditar.imagen && (
            <div className="mb-3">
              <img
                src={`http://localhost:3000/${pedidoEditar.imagen}`}
                alt="referencia"
                style={{ width: '150px', borderRadius: '8px' }}
              />
            </div>
          )}

          {!pedidoEditar && (
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </div>
          )}

          <h5 className="mb-3 mt-4">Notas</h5>

          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2"
            >
              {pedidoEditar ? 'Actualizar' : 'Guardar Pedido'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CrearPedido