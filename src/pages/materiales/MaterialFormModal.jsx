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
  const [imagenes, setImagenes] = useState([]); // [{ file, url }] — nuevas
  const [imagenesExistentes, setImagenesExistentes] = useState([]); // filenames del server
  // Filenames de las imágenes existentes que el usuario marcó para eliminar.
  // Se aplican al guardar; mientras tanto solo se ocultan de la UI.
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
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
      setImagenesAEliminar([]);
    } else {
      setForm(FORM_VACIO);
      limpiarImagenes();
      setImagenesExistentes([]);
      setImagenesAEliminar([]);
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
      // El límite considera tanto las imágenes ya guardadas en el server
      // como las nuevas que el usuario acaba de agregar en esta sesión.
      const totalActual = prev.length + imagenesExistentes.length;
      const espacioDisponible = Math.max(0, MAX_IMAGENES - totalActual);
      const aAgregar = validos.slice(0, espacioDisponible);

      if (validos.length > espacioDisponible) {
        errores.push(
          `Solo puedes tener ${MAX_IMAGENES} imágenes por material (este ya tiene ${imagenesExistentes.length + prev.length}).`
        );
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

  // Marca una imagen YA guardada en el server para eliminación. La quita de
  // la UI inmediatamente y la agrega a la lista que se enviará al backend
  // al guardar. Si el usuario cancela el modal, no se aplica el cambio.
  const quitarImagenExistente = (nombre) => {
    setImagenesExistentes((prev) => prev.filter((n) => n !== nombre));
    setImagenesAEliminar((prev) => (prev.includes(nombre) ? prev : [...prev, nombre]));
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
        // Si hay imágenes nuevas o imágenes existentes marcadas para eliminar,
        // mandamos multipart (multer en el backend acepta form-data con o
        // sin archivos). Si no hay cambios de imágenes, JSON simple.
        const hayCambiosImagenes =
          imagenes.length > 0 || imagenesAEliminar.length > 0;

        if (hayCambiosImagenes) {
          const data = new FormData();
          data.append("nombre_material", form.nombre_material.trim());
          data.append("descripcion_material", form.descripcion_material.trim());
          data.append("categoria_id", form.categoria_id);
          data.append(
            "precio_unitario",
            form.precio_unitario === "" ? "0" : form.precio_unitario
          );
          data.append("referencia_compra", form.referencia_compra.trim());
          data.append("stock", form.stock);
          imagenes.forEach((img) => data.append("imagenes", img.file));
          if (imagenesAEliminar.length > 0) {
            data.append(
              "imagenes_eliminar",
              JSON.stringify(imagenesAEliminar)
            );
          }

          await api.put(`/materiales/${materialId}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.put(`/materiales/${materialId}`, {
            nombre_material: form.nombre_material.trim(),
            descripcion_material: form.descripcion_material.trim(),
            categoria_id: form.categoria_id,
            precio_unitario:
              form.precio_unitario === "" ? 0 : form.precio_unitario,
            referencia_compra: form.referencia_compra.trim(),
            stock: form.stock,
          });
        }
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
                      {esEdicion && (
                        <span className="mat-modal__img-counter">
                          {imagenesExistentes.length + imagenes.length}/{MAX_IMAGENES}
                        </span>
                      )}
                    </p>

                    {/* En modo edición: imágenes ya guardadas en el server,
                        con botón X para marcarlas para eliminación */}
                    {esEdicion && imagenesExistentes.length > 0 && (
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
                            <button
                              type="button"
                              className="mat-modal__thumb-remove"
                              onClick={() => quitarImagenExistente(nombre)}
                              aria-label="Eliminar imagen"
                              title="Eliminar imagen"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropzone (en crear siempre; en editar solo si hay espacio).
                        En edit con imágenes existentes usamos el modifier
                        compacto para no eclipsar las miniaturas. */}
                    {(!esEdicion ||
                      imagenesExistentes.length + imagenes.length < MAX_IMAGENES) && (
                      <label
                        htmlFor="material-imagenes"
                        className={[
                          "mat-modal__dropzone",
                          arrastrando ? "mat-modal__dropzone--active" : "",
                          esEdicion && (imagenesExistentes.length > 0 || imagenes.length > 0)
                            ? "mat-modal__dropzone--compact"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <UploadCloud
                          size={
                            esEdicion && (imagenesExistentes.length > 0 || imagenes.length > 0)
                              ? 22
                              : 36
                          }
                        />
                        <strong>
                          {arrastrando
                            ? "Suelta las imágenes aquí"
                            : esEdicion
                              ? "Agregar imágenes"
                              : "Arrastra imágenes o haz clic"}
                        </strong>
                        <span>
                          PNG, JPG, JPEG o WEBP — máx. {MAX_IMAGENES} imágenes, 5MB c/u
                        </span>
                        <input
                          id="material-imagenes"
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          multiple
                          hidden
                          onChange={handleFiles}
                        />
                      </label>
                    )}

                    {/* Previews de las imágenes nuevas que el usuario está
                        agregando (tanto en crear como en editar) */}
                    {imagenes.length > 0 && (
                      <div className="mat-modal__thumb-grid">
                        {imagenes.map((img, idx) => (
                          <div
                            key={`${img.file.name}-${idx}`}
                            className="mat-modal__thumb mat-modal__thumb--nueva"
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

                    {esEdicion &&
                      imagenesExistentes.length === 0 &&
                      imagenes.length === 0 && (
                        <p className="mat-modal__empty-imgs">
                          Este material aún no tiene imágenes. Agrega hasta {MAX_IMAGENES}.
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
