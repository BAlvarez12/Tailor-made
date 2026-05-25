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
} from "lucide-react";

const getApiUploadsMateriales = () =>
  `${import.meta.env.VITE_BACKEND_URL}/uploads/materiales`;

const FORM_VACIO = {
  nombre_material: "",
  descripcion_material: "",
  categoria_id: "",
  precio_unitario: "",
  referencia_compra: "",
  stock: "",
};

function MaterialFormModal({ open, materialId, onClose }) {
  const esEdicion = Boolean(materialId);
  const [form, setForm] = useState(FORM_VACIO);
  const [imagenes, setImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

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

    if (esEdicion) {
      cargarMaterial();
      setImagenes([]);
    } else {
      setForm(FORM_VACIO);
      setImagenes([]);
      setImagenesExistentes([]);
      setCargando(false);
    }
  }, [open, esEdicion, materialId, cargarCategorias, cargarMaterial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    const nuevos = Array.from(e.target.files || []);
    setImagenes((prev) => [...prev, ...nuevos]);
    e.target.value = null;
  };

  const quitarImagenNueva = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
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
      setError("Selecciona una categoría.");
      return false;
    }
    if (form.precio_unitario === "" || Number(form.precio_unitario) < 0) {
      setError("Ingresa un precio válido.");
      return false;
    }
    if (!esEdicion && form.stock !== "" && Number(form.stock) < 0) {
      setError("La cantidad inicial no puede ser negativa.");
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
          precio_unitario: form.precio_unitario,
          referencia_compra: form.referencia_compra.trim(),
          stock: form.stock,
        });
      } else {
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          data.append(key, value);
        });
        imagenes.forEach((file) => data.append("imagenes", file));

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
          className="tm-modal tm-modal--md mat-modal--scroll"
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

              <div className="tm-modal__section">
                <p className="tm-modal__section-title">
                  <FileText size={16} />
                  Información general
                </p>

                <div className="tm-modal__grid">
                  <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                    <label htmlFor="nombre_material">Nombre</label>
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
                    <label htmlFor="categoria_id">Categoría</label>
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
                        required
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
                      <label htmlFor="stock">Cantidad inicial</label>
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
              </div>

              {!esEdicion && (
                <div className="tm-modal__section">
                  <p className="tm-modal__section-title">
                    <ImagePlus size={16} />
                    Imágenes
                  </p>
                  <div className="mat-modal__imagenes">
                    <label className="mat-modal__file-btn">
                      <ImagePlus size={18} />
                      Agregar imágenes
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFiles}
                      />
                    </label>
                    {imagenes.length > 0 && (
                      <ul className="mat-modal__img-list">
                        {imagenes.map((file, idx) => (
                          <li key={`${file.name}-${idx}`}>
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => quitarImagenNueva(idx)}
                              aria-label="Quitar"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {esEdicion && imagenesExistentes.length > 0 && (
                <div className="tm-modal__section">
                  <p className="tm-modal__section-title">
                    <ImagePlus size={16} />
                    Imágenes actuales
                  </p>
                  <div className="mat-modal__img-preview-grid">
                    {imagenesExistentes.map((img) => (
                      <img
                        key={img}
                        src={`${getApiUploadsMateriales()}/${img}`}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
              )}

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
