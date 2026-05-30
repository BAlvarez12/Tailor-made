/**
 * Test de integración del refactor SP -> query directa.
 * Ejecuta cada controller con req/res simulados contra la BD local,
 * valida la respuesta y limpia los datos creados al final.
 *
 *   node scripts/test_refactor.js
 */
const path = require('path')
const pool = require('../src/config/db')

const C = (p) => require(path.join(__dirname, '..', 'src', 'controller', p))

// ---- helpers ----
let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ✅ ${name}`) }
  else { fail++; console.log(`  ❌ ${name} ${extra}`) }
}

const mockRes = () => {
  const r = { statusCode: 200, body: undefined }
  r.status = (c) => { r.statusCode = c; return r }
  r.json = (b) => { r.body = b; return r }
  return r
}
const mkReq = ({ params = {}, body = {}, query = {}, user } = {}) => ({
  params, body, query, user, headers: {}, ip: '127.0.0.1',
})
const call = async (fn, reqOpts) => {
  const res = mockRes()
  await fn(mkReq(reqOpts), res)
  return res
}

const created = { clienteId: null, materialId: null, unidadId: null, tipoId: null, tipoMedidaParaMedidas: null }

;(async () => {
  try {
    // ---- datos base ----
    const [[u]] = await pool.query('SELECT usuario_id FROM usuarios LIMIT 1')
    if (!u) throw new Error('No hay usuarios en la BD para usar como usuario_creador')
    const usuario = { usuario_id: u.usuario_id }
    const [[cat]] = await pool.query('SELECT categoria_id FROM categorias_material LIMIT 1')
    const [tiposActivos] = await pool.query('SELECT tipo_medida_id FROM tipo_medidas WHERE estado = 1 LIMIT 2')
    const sufijo = String(Date.now())
    const dpi = sufijo.slice(0, 13).padEnd(13, '0')

    console.log(`\nBase: usuario_id=${usuario.usuario_id}, categoria_id=${cat ? cat.categoria_id : 'N/A'}, tipos_activos=${tiposActivos.length}`)

    // ============ CLIENTES ============
    console.log('\n== CLIENTES ==')
    const { crearCliente } = C('clientes/crearCliente')
    let res = await call(crearCliente, { body: { nombre: 'QA_TEST', apellido: 'Refactor', telefono: '12345678', dpi }, user: usuario })
    ok('crearCliente -> 200 + cliente_id', res.statusCode === 200 && res.body?.cliente_id, JSON.stringify(res.body))
    created.clienteId = res.body?.cliente_id

    const { leerClientes } = C('clientes/leerClientes')
    res = await call(leerClientes)
    ok('leerClientes -> array con nuestro cliente',
      Array.isArray(res.body) && res.body.some(c => c.cliente_id === created.clienteId))

    const { actualizarCliente } = C('clientes/actualizarCliente')
    res = await call(actualizarCliente, { params: { id: created.clienteId }, body: { nombre: 'QA_TEST_UPD', apellido: 'Refactor', telefono: '87654321', dpi, estado: 1 } })
    ok('actualizarCliente -> 200', res.statusCode === 200, JSON.stringify(res.body))
    const [[cliUpd]] = await pool.query('SELECT nombre_cliente, dpi, telefono FROM clientes WHERE cliente_id = ?', [created.clienteId])
    ok('actualizarCliente persiste nombre+dpi+telefono', cliUpd.nombre_cliente === 'QA_TEST_UPD' && cliUpd.dpi === dpi && cliUpd.telefono === '87654321', JSON.stringify(cliUpd))

    if (tiposActivos.length > 0) {
      const t1 = tiposActivos[0].tipo_medida_id
      created.tipoMedidaParaMedidas = t1
      const { guardarMedidas } = C('clientes/guardarMedidas')
      res = await call(guardarMedidas, { body: { cliente_id: created.clienteId, medidas: [{ tipo_medida_id: t1, valor: 10 }] }, user: usuario })
      ok('guardarMedidas -> 200', res.statusCode === 200, JSON.stringify(res.body))

      const { obtenerMedidasCliente } = C('clientes/obtenerMedidasCliente')
      res = await call(obtenerMedidasCliente, { params: { cliente_id: created.clienteId } })
      ok('obtenerMedidasCliente -> array con la medida', Array.isArray(res.body) && res.body.some(m => Number(m.valor) === 10))

      const { actualizarMedidas } = C('clientes/actualizarMedidas')
      res = await call(actualizarMedidas, { body: { cliente_id: created.clienteId, medidas: [{ tipo_medida_id: t1, valor: 20 }] }, user: usuario })
      ok('actualizarMedidas (update) -> 200', res.statusCode === 200, JSON.stringify(res.body))
      const [[med]] = await pool.query('SELECT valor FROM cliente_medidas WHERE cliente_id = ? AND tipo_medida_id = ?', [created.clienteId, t1])
      ok('actualizarMedidas upsert actualizó valor a 20', med && Number(med.valor) === 20, JSON.stringify(med))

      if (tiposActivos.length > 1) {
        const t2 = tiposActivos[1].tipo_medida_id
        res = await call(actualizarMedidas, { body: { cliente_id: created.clienteId, medidas: [{ tipo_medida_id: t2, valor: 33 }] }, user: usuario })
        const [[med2]] = await pool.query('SELECT valor FROM cliente_medidas WHERE cliente_id = ? AND tipo_medida_id = ?', [created.clienteId, t2])
        ok('actualizarMedidas (insert path) creó medida nueva', med2 && Number(med2.valor) === 33, JSON.stringify(med2))
      }
    } else {
      console.log('  ⚠️  Sin tipos de medida activos: se omiten pruebas de medidas')
    }

    const { obtenerClientePorId } = C('clientes/obtenerClientePorId')
    res = await call(obtenerClientePorId, { params: { id: created.clienteId } })
    ok('obtenerClientePorId -> cliente + medidas[]', res.statusCode === 200 && res.body?.cliente?.cliente_id === created.clienteId && Array.isArray(res.body?.medidas))

    // ============ MATERIALES ============
    console.log('\n== MATERIALES ==')
    const { getCategorias } = C('materiales/getCategorias')
    res = await call(getCategorias)
    ok('getCategorias -> array', Array.isArray(res.body))

    if (cat) {
      const { createMaterial } = C('materiales/CreateMaterial')
      const nombreMat = 'QA_MAT_' + sufijo
      res = await call(createMaterial, { body: { categoria_id: cat.categoria_id, nombre_material: nombreMat, descripcion_material: 'qa', precio_unitario: '10.50', referencia_compra: 'REF1', stock: '5' }, user: usuario })
      ok('createMaterial -> 200', res.statusCode === 200, JSON.stringify(res.body))
      const [[mat]] = await pool.query('SELECT material_id, stock FROM materiales WHERE nombre_material = ? ORDER BY material_id DESC LIMIT 1', [nombreMat])
      created.materialId = mat?.material_id
      ok('createMaterial persistió fila (stock=5)', mat && Number(mat.stock) === 5, JSON.stringify(mat))

      const { getMateriales } = C('materiales/getMateriales')
      res = await call(getMateriales)
      ok('getMateriales -> array con imagenes[] normalizado',
        Array.isArray(res.body) && res.body.some(m => m.material_id === created.materialId && Array.isArray(m.imagenes)))

      const obtenerMaterialesActivos = C('materiales/obtenerMaterialesActivos')
      res = await call(obtenerMaterialesActivos)
      ok('obtenerMaterialesActivos -> array', Array.isArray(res.body) && res.body.some(m => m.material_id === created.materialId))

      const { updateMaterial } = C('materiales/UpdateMaterial')
      res = await call(updateMaterial, { params: { id: created.materialId }, body: { nombre_material: 'QA_MAT_UPD_' + sufijo, descripcion_material: 'qa2', categoria_id: cat.categoria_id, precio_unitario: '12', referencia_compra: 'REF2', stock: '8' } })
      ok('updateMaterial -> 200', res.statusCode === 200, JSON.stringify(res.body))

      const { createMovimientoExistencias } = C('materiales/createMovimientoExistencias')
      res = await call(createMovimientoExistencias, { body: { material_id: created.materialId, cantidad: 3 }, user: usuario })
      ok('movimiento ENTRADA(+3) -> 200', res.statusCode === 200, JSON.stringify(res.body))
      const [[matStock]] = await pool.query('SELECT stock FROM materiales WHERE material_id = ?', [created.materialId])
      ok('movimiento subió stock 8 -> 11', matStock && Number(matStock.stock) === 11, JSON.stringify(matStock))

      res = await call(createMovimientoExistencias, { body: { material_id: created.materialId, cantidad: -9999 }, user: usuario })
      ok('movimiento SALIDA insuficiente -> 400 "Stock insuficiente"', res.statusCode === 400 && /insuficiente/i.test(res.body?.error || ''), JSON.stringify(res.body))

      res = await call(createMovimientoExistencias, { body: { material_id: 99999999, cantidad: 1 }, user: usuario })
      ok('movimiento material inexistente -> 400 "Material no existe"', res.statusCode === 400 && /no existe/i.test(res.body?.error || ''), JSON.stringify(res.body))

      const { deleteMaterial } = C('materiales/DeleteMaterial')
      res = await call(deleteMaterial, { params: { id: created.materialId } })
      ok('deleteMaterial (soft) -> 200', res.statusCode === 200, JSON.stringify(res.body))
      const [[matDel]] = await pool.query('SELECT estado FROM materiales WHERE material_id = ?', [created.materialId])
      ok('deleteMaterial puso estado=0', matDel && Number(matDel.estado) === 0, JSON.stringify(matDel))
    } else {
      console.log('  ⚠️  Sin categorías: se omiten pruebas de materiales')
    }

    // ============ UNIDADES ============
    console.log('\n== UNIDADES ==')
    const createUnidad = C('unidades/createUnidad')
    const nombreUni = 'QA_U_' + sufijo
    res = await call(createUnidad, { body: { nombre_unidad: nombreUni, simbolo_unidad: 'qu' }, user: usuario })
    ok('createUnidad -> 200', res.statusCode === 200, JSON.stringify(res.body))
    const [[uni]] = await pool.query('SELECT unidad_id FROM unidades_medida WHERE nombre_unidad = ? ORDER BY unidad_id DESC LIMIT 1', [nombreUni])
    created.unidadId = uni?.unidad_id
    ok('createUnidad persistió fila', !!created.unidadId)

    res = await call(createUnidad, { body: { nombre_unidad: nombreUni, simbolo_unidad: 'qu' }, user: usuario })
    ok('createUnidad duplicada -> 409 "ya existe"', res.statusCode === 409 && /ya existe/i.test(res.body?.error || ''), JSON.stringify(res.body))

    const getUnidades = C('unidades/getUnidades')
    res = await call(getUnidades, { query: { archivados: 'false' } })
    ok('getUnidades activos -> array con la nuestra', Array.isArray(res.body) && res.body.some(x => x.unidad_id === created.unidadId))

    const updateUnidad = C('unidades/updateUnidad')
    // nombre_unidad es VARCHAR(20): mantenemos el nombre dentro del límite
    const nombreUniUpd = nombreUni.slice(0, 19) + 'X'
    res = await call(updateUnidad, { params: { id: created.unidadId }, body: { nombre_unidad: nombreUniUpd, simbolo_unidad: 'q2' } })
    ok('updateUnidad -> 200', res.statusCode === 200, JSON.stringify(res.body))
    const [[uniUpd]] = await pool.query('SELECT nombre_unidad, simbolo_unidad FROM unidades_medida WHERE unidad_id = ?', [created.unidadId])
    ok('updateUnidad persistió cambios', uniUpd && uniUpd.nombre_unidad === nombreUniUpd && uniUpd.simbolo_unidad === 'q2', JSON.stringify(uniUpd))

    const archiveUnidad = C('unidades/archiveUnidad')
    res = await call(archiveUnidad, { params: { id: created.unidadId } })
    ok('archiveUnidad -> 200', res.statusCode === 200)
    res = await call(getUnidades, { query: { archivados: 'true' } })
    ok('getUnidades archivados muestra la nuestra', Array.isArray(res.body) && res.body.some(x => x.unidad_id === created.unidadId))

    const restoreUnidad = C('unidades/restoreUnidad')
    res = await call(restoreUnidad, { params: { id: created.unidadId } })
    ok('restoreUnidad -> 200', res.statusCode === 200)
    const [[uniEstado]] = await pool.query('SELECT estado FROM unidades_medida WHERE unidad_id = ?', [created.unidadId])
    ok('restoreUnidad dejó estado=1', uniEstado && Number(uniEstado.estado) === 1)

    // ============ TIPOS DE MEDIDA ============
    console.log('\n== TIPOS DE MEDIDA ==')
    const createTipo = C('tipos_medidas/createTipo')
    const nombreTipo = 'QA_T_' + sufijo
    res = await call(createTipo, { body: { nombre_tipo_medida: nombreTipo, descripcion_tipo_medida: 'qa' }, user: usuario })
    ok('createTipo -> 200', res.statusCode === 200, JSON.stringify(res.body))
    const [[tip]] = await pool.query('SELECT tipo_medida_id FROM tipo_medidas WHERE nombre_tipo_medida = ? ORDER BY tipo_medida_id DESC LIMIT 1', [nombreTipo])
    created.tipoId = tip?.tipo_medida_id
    ok('createTipo persistió fila', !!created.tipoId)

    res = await call(createTipo, { body: { nombre_tipo_medida: nombreTipo, descripcion_tipo_medida: 'qa' }, user: usuario })
    ok('createTipo duplicado -> 400 "ya existe"', res.statusCode === 400 && /ya existe/i.test(res.body?.error || ''), JSON.stringify(res.body))

    const { obtenerTiposMedidaActivos } = C('tipos_medidas/obtenerTiposMedidaActivos')
    res = await call(obtenerTiposMedidaActivos)
    ok('obtenerTiposMedidaActivos -> array con el nuestro', Array.isArray(res.body) && res.body.some(x => x.tipo_medida_id === created.tipoId))

    const updateTipo = C('tipos_medidas/updateTipo')
    res = await call(updateTipo, { params: { id: created.tipoId }, body: { nombre_tipo_medida: nombreTipo + '_UPD', descripcion_tipo_medida: 'qa2' } })
    ok('updateTipo -> 200', res.statusCode === 200, JSON.stringify(res.body))

    const archiveTipo = C('tipos_medidas/archiveTipo')
    res = await call(archiveTipo, { params: { id: created.tipoId } })
    ok('archiveTipo -> 200', res.statusCode === 200)
    const restoreTipo = C('tipos_medidas/restoreTipo')
    res = await call(restoreTipo, { params: { id: created.tipoId } })
    ok('restoreTipo -> 200', res.statusCode === 200)

    const obtenerTiposMedidaPorPrenda = C('tipos_medidas/obtenerTiposMedidaPorPrenda')
    const [[tp]] = await pool.query('SELECT tipo_prendas_id FROM tipo_prendas LIMIT 1')
    res = await call(obtenerTiposMedidaPorPrenda, { params: { prendaId: tp ? tp.tipo_prendas_id : 1 } })
    ok('obtenerTiposMedidaPorPrenda -> array (sin error)', Array.isArray(res.body), JSON.stringify(res.body))

  } catch (e) {
    console.error('\n💥 Error inesperado en el test:', e)
    fail++
  } finally {
    // ---- limpieza ----
    console.log('\n== LIMPIEZA ==')
    try {
      if (created.clienteId) {
        await pool.query('DELETE FROM cliente_medidas WHERE cliente_id = ?', [created.clienteId])
        await pool.query('DELETE FROM clientes WHERE cliente_id = ?', [created.clienteId])
      }
      if (created.materialId) {
        await pool.query('DELETE FROM detalle_existencias WHERE material_id = ?', [created.materialId])
        await pool.query('DELETE FROM materiales_img WHERE material_id = ?', [created.materialId])
        await pool.query('DELETE FROM materiales WHERE material_id = ?', [created.materialId])
      }
      if (created.unidadId) await pool.query('DELETE FROM unidades_medida WHERE unidad_id = ?', [created.unidadId])
      if (created.tipoId) await pool.query('DELETE FROM tipo_medidas WHERE tipo_medida_id = ?', [created.tipoId])
      console.log('  Datos de prueba eliminados.')
    } catch (e) {
      console.log('  ⚠️  No se pudo limpiar todo:', e.message)
    }

    // dar un instante al log fire-and-forget antes de cerrar el pool
    await new Promise(r => setTimeout(r, 400))
    await pool.end()

    console.log(`\n===== RESULTADO: ${pass} OK, ${fail} FALLOS =====`)
    process.exit(fail > 0 ? 1 : 0)
  }
})()
