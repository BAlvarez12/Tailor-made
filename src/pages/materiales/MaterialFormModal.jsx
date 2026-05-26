import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import "../../styles/tmModalShared.css";
import "./MaterialesModales.css";
import {
  Package,
  Plus,
  Settings,
  FileText,
  Tag,
  Hash,
  Layers,
  ImagePlus,
  Save,
  XCircle,
  UploadCloud,
  X,
} from "lucide-react";

const getApiUploadsMateriales = () =>
  `${import.meta.env.VITE_BACKEND_URL}/uploads/materiales`;

const MAX_IMAGENES = 3;
const MAX_TAMANIO_BYTES = 5 * 1024 * 1024; // 5MB
const TIPOS_MIME_VALIDOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const EXTENSIONES_VALIDAS = /\.(jpe?g|png|webp)$/i;

const FORM_VACIO = {
  nombre_material: "",
  descripcion_material: "",
  categoria_id: "",
  precio_unitario: "",
  referencia_compra: "",
  stock: "",
};

const Obligatorio = () => (
  <span className="mat-modal__required" aria-hidden="true">*</span>
);

function MaterialFormModal({ open, materialId, onClose }) {
  const esEdicion = Boolean(materialId);
  const [form, setForm] = useState(FORM_VACIO);
  const [imagenes, setImagenes] = useState([]); // [{ file, url }]
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [arrastrando, setArrastrando] = useState(false);

  const limpiarImagenes = useCallback(() => {
    setImagenes((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url));
      return [];
    });
  }, []);

  const cargarCategorias = useCallback(async () => {
    try {
      const res = await api.get("/materiales/categorias");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCategorias([]);
    }
  }, []);

  const cargarMaterial = useCallback(async () => {
    if (!materialId) return;
    try {
      setCargando(true);
      const res = await api.get("/materiales");
      const lista = Array.isArray(res.data) ? res.data : [];
      const mat = lista.find((m) => String(m.material_id) === String(materialId));

      if (!mat) {
        setError("No se encontró el material.");
        return;
      }

      setForm({
        nombre_material: mat.nombre_material || "",
        descripcion_material: mat.descripcion_material || "",
        categoria_id: mat.categoria_id ? String(mat.categoria_id) : "",
        precio_unitario: mat.precio_unitario ?? "",
        referencia_compra: mat.referencia_compra || "",
        stock: mat.stock ?? "",
      });
      setImagenesExistentes(Array.isArray(mat.imagenes) ? mat.imagenes : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el material.");
    } finally {
      setCargando(false);
    }
  }, [materialId]);

  useEffect(() => {
    if (!open) return;
    cargarCategorias();
    setError("");
    setArrastrando(false);

    if (esEdicion) {
      cargarMaterial();
      limpiarImagenes();
    } else {
      setForm(FORM_VACIO);
      limpiarImagenes();
      setImagenesExistentes([]);
      setCargando(false);
    }
  }, [open, esEdicion, materialId, cargarCategorias, cargarMaterial, limpiarImagenes]);

  useEffect(() => {
    return () => {
      imagenes.forEach((img) => URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const agregarArchivos = (fileList) => {
    const arr = Array.from(fileList || []);
    if (arr.length === 0) return;

    const errores = [];
    const validos = [];

    for (const file of arr) {
      const mimeOk = TIPOS_MIME_VALIDOS.includes(file.type);
      const extOk = EXTENSIONES_VALIDAS.test(file.name);

      if (!mimeOk || !extOk) {
        errores.push(`"${file.name}" no es una imagen válida (solo JPG, PNG o WEBP).`);
        continue;
      }
      if (file.size > MAX_TAMANIO_BYTES) {
        errores.push(`"${file.name}" supera los 5MB.`);
        continue;
      }
      validos.push(file);
    }

    setImagenes((prev) => {
      const espacioDisponible = Math.max(0, MAX_IMAGENES - prev.length);
      const aAgregar = validos.slice(0, espacioDisponible);

      if (validos.length > espacioDisponible) {
        errores.push(`Solo puedes subir ${MAX_IMAGENES} imágenes por material.`);
      }

      if (errores.length) setError(errores.join(" "));
      else setError("");

      if (aAgregar.length === 0) return prev;

      const nuevos = aAgregar.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...nuevos];
    });
  };

  const handleFiles = (e) => {
    agregarArchivos(e.target.files);
    e.target.value = null;
  };

  const quitarImagenNueva = (index) => {
    setImagenes((prev) => {
      const eliminada = prev[index];
      if (eliminada) URL.revokeObjectURL(eliminada.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!arrastrando) setArrastrando(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setArrastrando(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer?.files?.length) {
      agregarArchivos(e.dataTransfer.files);
    }
  };

  const handleCerrar = () => {
    if (guardando) return;
    onClose?.();
  };

  const validar = () => {
    if (!form.nombre_material.trim()) {
      setError("El nombre del material es obligatorio.");
      return false;
    }
    if (!form.categoria_id) {
      setError("La categoría es obligatoria.");
      return false;
    }
    if (!esEdicion) {
      const stockTxt = String(form.stock ?? "").trim();
      if (stockTxt === "") {
        setError("La cantidad inicial es obligatoria.");
        return false;
      }
      if (Number.isNaN(Number(stockTxt)) || Number(stockTxt) < 0) {
        setError("La cantidad inicial debe ser un número mayor o igual a 0.");
        return false;
      }
    }
    if (form.precio_unitario !== "" && Number(form.precio_unitario) < 0) {
      setError("El precio no puede ser negativo.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validar()) return;

    try {
      setGuardando(true);

      if (esEdicion) {
        await api.put(`/materiales/${materialId}`, {
          nombre_material: form.nombre_material.trim(),
          descripcion_material: form.descripcion_material.trim(),
          categoria_id: form.categoria_id,
          precio_unitario:
            form.precio_unitario === "" ? 0 : form.precio_unitario,
          referencia_compra: form.referencia_compra.trim(),
          stock: form.stock,
        });
      } else {
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          const finalVal =
            key === "precio_unitario" && value === "" ? "0" : value;
          data.append(key, finalVal);
        });
        imagenes.forEach((img) => data.append("imagenes", img.file));

        await api.post("/materiales", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleCerrar();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "No se pudo guardar el material."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={handleCerrar}>
        <div
          className="tm-modal mat-modal--wide mat-modal--scroll"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="material-form-title"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                {esEdicion ? <Settings size={22} /> : <Plus size={22} />}
              </div>
              <div>
                <h2 id="material-form-title">
                  {esEdicion ? "Editar material" : "Crear material"}
                </h2>
                <p className="tm-modal__subtitle">
                  {esEdicion
                    ? "Actualiza los datos del insumo. Para existencia usa «+ Existencia»."
                    : "Registra un nuevo material con categoría, precio e imágenes."}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={handleCerrar}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {cargando ? (
            <p className="mat-modal__loading">Cargando material...</p>
          ) : categorias.length === 0 ? (
            <p className="mat-modal__error">
              No hay categorías disponibles. Usa «Agregar categorías» en la pantalla de materiales.
            </p>
          ) : (
            <form className="tm-modal__form" onSubmit={handleSubmit}>
              {error && <p className="mat-modal__error">{error}</p>}

              <div className="mat-modal__layout">
                {/* IZQUIERDA: Información del material */}
                <div className="mat-modal__columna mat-modal__columna--info">
                  <div className="tm-modal__section">
                    <p className="tm-modal__section-title">
                      <FileText size={16} />
                      Información general
                    </p>

                    <div className="tm-modal__grid tm-modal__grid--single">
                      <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                        <label htmlFor="nombre_material">
                          Nombre <Obligatorio />
                        </label>
                        <div className="tm-input-wrap">
                          <Package size={16} className="tm-input-icon" />
                          <input
                            id="nombre_material"
                            name="nombre_material"
                            type="text"
                            value={form.nombre_material}
                            onChange={handleChange}
                            placeholder="Ej. Tela satén"
                            required
                          />
                        </div>
                      </div>

                      <div className="tm-modal__field tm-modal__field--icon">
                        <label htmlFor="categoria_id">
                          Categoría <Obligatorio />
                        </label>
                        <div className="tm-input-wrap">
                          <Tag size={16} className="tm-input-icon" />
                          <select
                            id="categoria_id"
                            name="categoria_id"
                            value={form.categoria_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccionar</option>
                            {categorias.map((cat) => (
                              <option
                                key={cat.categoria_id}
                                value={cat.categoria_id}
                              >
                                {cat.nombre_categoria}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="tm-modal__field">
                        <label htmlFor="precio_unitario">Precio unitario</label>
                        <div className="tm-input-wrap mat-modal__input-currency">
                          <span className="mat-modal__currency" aria-hidden>Q</span>
                          <input
                            id="precio_unitario"
                            name="precio_unitario"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.precio_unitario}
                            onChange={handleChange}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="tm-modal__field tm-modal__field--icon">
                        <label htmlFor="referencia_compra">Referencia de compra</label>
                        <div className="tm-input-wrap">
                          <Hash size={16} className="tm-input-icon" />
                          <input
                            id="referencia_compra"
                            name="referencia_compra"
                            type="text"
                            value={form.referencia_compra}
                            onChange={handleChange}
                            placeholder="Opcional"
                          />
                        </div>
                      </div>

                      {!esEdicion && (
                        <div className="tm-modal__field tm-modal__field--icon">
                          <label htmlFor="stock">
                            Cantidad inicial <Obligatorio />
                          </label>
                          <div className="tm-input-wrap">
                            <Layers size={16} className="tm-input-icon" />
                            <input
                              id="stock"
                              name="stock"
                              type="number"
                              min="0"
                              step="1"
                              value={form.stock}
                              onChange={handleChange}
                              placeholder="0"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {esEdicion && (
                        <div className="tm-modal__field">
                          <label>Existencia actual</label>
                          <div className="mat-modal__stock-readonly">
                            {form.stock ?? 0} unidades
                            <span>Usa «+ Existencia» en el listado para ajustar stock.</span>
                          </div>
                        </div>
                      )}

                      <div className="tm-modal__field tm-modal__field--full">
                        <label htmlFor="descripcion_material">Descripción</label>
                        <textarea
                          id="descripcion_material"
                          name="descripcion_material"
                          rows={3}
                          value={form.descripcion_material}
                          onChange={handleChange}
                          placeholder="Detalles del material..."
                        />
                      </div>
                    </div>

                    <p className="mat-modal__required-note">
                      <Obligatorio />
                      Campos obligatorios
                    </p>
                  </div>
                </div>

                {/* DERECHA: Imágenes */}
                <div className="mat-modal__columna mat-modal__columna--imagenes">
                  <div className="tm-modal__section">
                    <p className="tm-modal__section-title">
                      <ImagePlus size={16} />
                      Imágenes
                    </p>

                    {!esEdicion ? (
                      <>
                        <label
                          htmlFor="material-imagenes"
                          className={`mat-modal__dropzone${arrastrando ? " mat-modal__dropzone--active" : ""}`}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <UploadCloud size={36} />
                          <strong>
                            {arrastrando
                              ? "Suelta las imágenes aquí"
                              : "Arrastra imágenes o haz clic"}
                          </strong>
                          <span>PNG, JPG, JPEG o WEBP — máx. 3 imágenes, 5MB c/u</span>
                          <input
                            id="material-imagenes"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            multiple
                            hidden
                            onChange={handleFiles}
                          />
                        </label>

                        {imagenes.length > 0 && (
                          <div className="mat-modal__thumb-grid">
                            {imagenes.map((img, idx) => (
                              <div
                                key={`${img.file.name}-${idx}`}
                                className="mat-modal__thumb"
                              >
                                <img src={img.url} alt={img.file.name} />
                                <button
                                  type="button"
                                  className="mat-modal__thumb-remove"
                                  onClick={() => quitarImagenNueva(idx)}
                                  aria-label="Quitar imagen"
                                >
                                  <X size={14} />
                                </button>
                                <span className="mat-modal__thumb-name">
                                  {img.file.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : imagenesExistentes.length > 0 ? (
                      <div className="mat-modal__thumb-grid">
                        {imagenesExistentes.map((nombre) => (
                          <div key={nombre} className="mat-modal__thumb">
                            <img
                              src={`${getApiUploadsMateriales()}/${encodeURIComponent(nombre)}`}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mat-modal__empty-imgs">
                        Este material no tiene imágenes guardadas.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="tm-modal__actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCerrar}
                  disabled={guardando}
                >
                  <XCircle size={16} />
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar" disabled={guardando}>
                  <Save size={16} />
                  {guardando
                    ? "Guardando..."
                    : esEdicion
                      ? "Guardar cambios"
                      : "Crear material"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MaterialFormModal;
