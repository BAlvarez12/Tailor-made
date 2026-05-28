import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { toast } from 'react-toastify'

// Convierte un Blob a string base64 (sin el prefix data:...).
// Filesystem.writeFile espera base64 puro para datos binarios.
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      // reader.result viene como "data:application/pdf;base64,XXXX..."
      const base64 = typeof result === 'string' ? result.split(',')[1] : ''
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })

// Descarga en navegador (creates <a download>). Usado como fallback web.
const descargarEnWeb = (blob, nombreArchivo) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => window.URL.revokeObjectURL(url), 60000)
}

// Descarga en Android nativo: escribe el archivo en Documents/Tailor-made/.
// Esa carpeta es visible desde la app de archivos del celular y desde
// galerías de PDF (Drive, Adobe, etc.).
const descargarEnNativo = async (blob, nombreArchivo) => {
  const base64 = await blobToBase64(blob)

  await Filesystem.writeFile({
    path: `Tailor-made/${nombreArchivo}`,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  })

  toast.success(
    `PDF guardado en Documentos/Tailor-made/${nombreArchivo}`,
    { autoClose: 4000 }
  )
}

// Abre PDF en pestaña nueva (comportamiento clásico desktop).
const abrirEnVentanaNueva = (blob, nombreArchivo) => {
  const url = window.URL.createObjectURL(blob)
  const ventana = window.open(url, '_blank')

  if (!ventana) {
    // Si el navegador bloqueó el popup, fallback a descarga directa
    descargarEnWeb(blob, nombreArchivo)
    return
  }

  setTimeout(() => window.URL.revokeObjectURL(url), 60000)
}

/**
 * Maneja la entrega de un PDF al usuario según la plataforma:
 *   - APK (Android nativo)  → escribe en Documents/Tailor-made + toast
 *   - Web (desktop / dev)   → abre en nueva pestaña, fallback a descarga
 */
export const entregarPdf = async (blob, nombreArchivo) => {
  const nombre = nombreArchivo?.toLowerCase().endsWith('.pdf')
    ? nombreArchivo
    : `${nombreArchivo || 'documento'}.pdf`

  if (Capacitor.isNativePlatform()) {
    try {
      await descargarEnNativo(blob, nombre)
    } catch (err) {
      console.error('Error al guardar PDF nativo:', err)
      toast.error('No se pudo guardar el PDF en el teléfono.')
      throw err
    }
  } else {
    abrirEnVentanaNueva(blob, nombre)
  }
}
