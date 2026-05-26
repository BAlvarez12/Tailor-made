import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import "../../styles/tmModalShared.css";
import "./MaterialesModales.css";
import {
  Plus,
  Settings,
  Tag,
  FileText,
  Layers,
  Pencil,
  Save,
  XCircle,
  List,
} from "lucide-react";

const FORM_VACIO = {
  nombre_categoria: "",
  descripcion_categoria: "",
};

function CategoriasMaterialModal({ open, onClose }) {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editId, setEditId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const esEdicion = Boolean(editId);

  const cargarCategorias = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const res = await api.get("/materiales/categorias");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las categorías.");
      setCategorias([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm(FORM_VACIO);
    setEditId(null);
    setError("");
    setExito("");
    cargarCategorias();
  }, [open, cargarCategorias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const limpiarFormulario = () => {
    setForm(FORM_VACIO);
    setEditId(null);
    setError("");
  };

  const iniciarEdicion = (categoria) => {
    setEditId(categoria.categoria_id);
    setForm({
      nombre_categoria: categoria.nombre_categoria || "",
      descripcion_categoria: categoria.descripcion_categoria || "",
    });
    setError("");
    setExito("");
  };

  const handleCerrar = () => {
    if (guardando) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    const nombre = form.nombre_categoria.trim();
    if (!nombre) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    const payload = {
      nombre_categoria: nombre,
      descripcion_categoria: form.descripcion_categoria.trim(),
    };

    try {
      setGuardando(true);

      if (esEdicion) {
        await api.put(`/materiales/categorias/${editId}`, payload);
        setExito("Categoría actualizada correctamente.");
      } else {
        await api.post("/materiales/categorias", payload);
        setExito("Categoría creada correctamente.");
      }

      limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "No se pudo guardar la categoría."
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
          className="tm-modal tm-modal--lg mat-modal--scroll mat-cat-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="categorias-material-title"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                <Layers size={22} />
              </div>
              <div>
                <h2 id="categorias-material-title">Categorías de materiales</h2>
                <p className="tm-modal__subtitle">
                  Crea y edita las categorías para organizar tu catálogo de insumos.
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

          <form className="tm-modal__form mat-cat-modal__form" onSubmit={handleSubmit}>
            <div className="mat-cat-layout">
              <section className="mat-cat-layout__list tm-modal__section mat-cat-list-section">
                <p className="tm-modal__section-title">
                  <List size={16} />
                  Categorías registradas
                  {!cargando && (
                    <span className="mat-cat-count">{categorias.length}</span>
                  )}
                </p>

                {cargando ? (
                  <p className="mat-modal__loading mat-cat-layout__loading">
                    Cargando categorías...
                  </p>
                ) : categorias.length === 0 ? (
                  <p className="mat-cat-empty">
                    Aún no hay categorías. Crea la primera en el formulario de la
                    derecha.
                  </p>
                ) : (
                  <ul className="mat-cat-list">
                    {categorias.map((cat) => (
                      <li
                        key={cat.categoria_id}
                        className={
                          editId === cat.categoria_id
                            ? "mat-cat-list__item is-editing"
                            : "mat-cat-list__item"
                        }
                      >
                        <div className="mat-cat-list__info">
                          <strong>{cat.nombre_categoria}</strong>
                          {cat.descripcion_categoria ? (
                            <span>{cat.descripcion_categoria}</span>
                          ) : (
                            <span className="mat-cat-list__muted">Sin descripción</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="mat-cat-list__edit"
                          onClick={() => iniciarEdicion(cat)}
                          disabled={guardando}
                        >
                          <Pencil size={15} />
                          Editar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="mat-cat-layout__panel tm-modal__section">
                {error && <p className="mat-modal__error">{error}</p>}
                {exito && <p className="mat-cat-success">{exito}</p>}

                <p className="tm-modal__section-title">
                  {esEdicion ? <Settings size={16} /> : <Plus size={16} />}
                  {esEdicion ? "Editar categoría" : "Nueva categoría"}
                </p>

                <div className="tm-modal__grid tm-modal__grid--single">
                  <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                    <label htmlFor="nombre_categoria">
                      Nombre <span className="tm-required">*</span>
                    </label>
                    <div className="tm-input-wrap">
                      <Tag size={16} className="tm-input-icon" />
                      <input
                        id="nombre_categoria"
                        name="nombre_categoria"
                        type="text"
                        value={form.nombre_categoria}
                        onChange={handleChange}
                        placeholder="Ej. Telas, Hilos, Botones"
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                    <label htmlFor="descripcion_categoria">Descripción (opcional)</label>
                    <div className="tm-input-wrap tm-input-wrap--textarea">
                      <FileText size={16} className="tm-input-icon" />
                      <textarea
                        id="descripcion_categoria"
                        name="descripcion_categoria"
                        rows={4}
                        value={form.descripcion_categoria}
                        onChange={handleChange}
                        placeholder="Descripción opcional de la categoría..."
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>

                <p className="tm-required-note">
                  <span className="tm-required">*</span> Campos obligatorios
                </p>

                <div className="tm-modal__actions mat-cat-form-actions">
                  {esEdicion && (
                    <button
                      type="button"
                      className="btn-cancelar"
                      onClick={limpiarFormulario}
                      disabled={guardando}
                    >
                      <XCircle size={16} />
                      Cancelar edición
                    </button>
                  )}
                  <button type="submit" className="btn-guardar" disabled={guardando}>
                    {esEdicion ? <Save size={16} /> : <Plus size={16} />}
                    {guardando
                      ? "Guardando..."
                      : esEdicion
                        ? "Guardar cambios"
                        : "Crear categoría"}
                  </button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CategoriasMaterialModal;
