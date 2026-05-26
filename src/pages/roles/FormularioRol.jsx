import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
  Shield,
  Settings,
  Save,
  XCircle,
  Lock,
  FileText,
} from "lucide-react";
import { CATEGORIAS_PERMISOS } from "../../utils/permisos";
import {
  obtenerRolPorIdService,
  crearRolService,
  actualizarRolService,
} from "../../services/rolesService";
import "../../styles/tmModalShared.css";
import "./roles.css";

function FormularioRol({ open, rolId, permisosBackend, onClose }) {
  const esEdicion = Boolean(rolId);

  const [nombre, setNombre] = useState("");
  const [permisosSel, setPermisosSel] = useState(new Set());
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const codigoToId = useMemo(() => {
    const map = new Map();
    for (const p of permisosBackend || []) {
      map.set(p.nombre_permiso, p.permiso_id);
    }
    return map;
  }, [permisosBackend]);

  const idToCodigo = useMemo(() => {
    const map = new Map();
    for (const p of permisosBackend || []) {
      map.set(p.permiso_id, p.nombre_permiso);
    }
    return map;
  }, [permisosBackend]);

  const cargarRol = useCallback(async () => {
    if (!rolId) return;
    try {
      setCargando(true);
      const data = await obtenerRolPorIdService(rolId);
      setNombre(data.nombre_rol || "");
      const codigos = new Set();
      for (const pid of data.permiso_ids || []) {
        const cod = idToCodigo.get(pid);
        if (cod) codigos.add(cod);
      }
      setPermisosSel(codigos);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el rol.");
    } finally {
      setCargando(false);
    }
  }, [rolId, idToCodigo]);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (esEdicion) {
      cargarRol();
    } else {
      setNombre("");
      setPermisosSel(new Set());
      setCargando(false);
    }
  }, [open, esEdicion, cargarRol]);

  const toggle = (codigo) => {
    setPermisosSel((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) next.delete(codigo);
      else next.add(codigo);
      return next;
    });
  };

  const marcarCategoria = (categoria) => {
    setPermisosSel((prev) => {
      const next = new Set(prev);
      categoria.permisos.forEach((p) => next.add(p.codigo));
      return next;
    });
  };

  const desmarcarCategoria = (categoria) => {
    setPermisosSel((prev) => {
      const next = new Set(prev);
      categoria.permisos.forEach((p) => next.delete(p.codigo));
      return next;
    });
  };

  const todosMarcados = (categoria) =>
    categoria.permisos.every((p) => permisosSel.has(p.codigo));

  const cerrar = () => {
    if (guardando) return;
    onClose?.(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre del rol es obligatorio.");
      return;
    }

    const permiso_ids = [];
    for (const cod of permisosSel) {
      const id = codigoToId.get(cod);
      if (id) permiso_ids.push(id);
    }

    try {
      setGuardando(true);
      setError("");
      if (esEdicion) {
        await actualizarRolService(rolId, {
          nombre_rol: nombre.trim(),
          permiso_ids,
        });
        toast.success("Rol actualizado.");
      } else {
        await crearRolService({
          nombre_rol: nombre.trim(),
          permiso_ids,
        });
        toast.success("Rol creado.");
      }
      onClose?.(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "No se pudo guardar el rol."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={cerrar}>
        <div
          className="tm-modal rol-modal rol-modal--scroll"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rol-form-title"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                {esEdicion ? <Settings size={22} /> : <Shield size={22} />}
              </div>
              <div>
                <h2 id="rol-form-title">
                  {esEdicion ? "Editar rol" : "Crear rol"}
                </h2>
                <p className="tm-modal__subtitle">
                  Define el nombre y los permisos que tendrá este rol.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={cerrar}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {cargando ? (
            <p className="rol-modal__loading">Cargando rol...</p>
          ) : (
            <form className="tm-modal__form" onSubmit={submit}>
              {error && <p className="rol-modal__error">{error}</p>}

              <div className="tm-modal__section">
                <p className="tm-modal__section-title">
                  <FileText size={16} />
                  Información del rol
                </p>

                <div className="tm-modal__grid tm-modal__grid--single">
                  <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                    <label htmlFor="nombre_rol">
                      Nombre del rol{" "}
                      <span className="rol-modal__req" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <div className="tm-input-wrap">
                      <Shield size={16} className="tm-input-icon" />
                      <input
                        id="nombre_rol"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Vendedor, Administrador, Bodega..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tm-modal__section">
                <div className="rol-modal__section-header">
                  <p className="tm-modal__section-title">
                    <Lock size={16} />
                    Permisos asignados
                  </p>
                  <span className="rol-modal__counter">
                    {permisosSel.size} seleccionados
                  </span>
                </div>

                <div className="rol-modal__permisos">
                  {CATEGORIAS_PERMISOS.map((cat) => {
                    const allOn = todosMarcados(cat);
                    return (
                      <div key={cat.id} className="rol-modal__cat">
                        <div className="rol-modal__cat-header">
                          <span className="rol-modal__cat-name">
                            {cat.nombre}
                          </span>
                          <button
                            type="button"
                            className="rol-modal__cat-toggle"
                            onClick={() =>
                              allOn
                                ? desmarcarCategoria(cat)
                                : marcarCategoria(cat)
                            }
                          >
                            {allOn ? "Desmarcar todos" : "Marcar todos"}
                          </button>
                        </div>
                        <div className="rol-modal__cat-perms">
                          {cat.permisos.map((p) => (
                            <label
                              key={p.codigo}
                              className="rol-modal__check"
                            >
                              <input
                                type="checkbox"
                                checked={permisosSel.has(p.codigo)}
                                onChange={() => toggle(p.codigo)}
                              />
                              <span>{p.etiqueta}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="rol-modal__required-note">
                  <span className="rol-modal__req" aria-hidden="true">
                    *
                  </span>
                  Campos obligatorios
                </p>
              </div>

              <div className="tm-modal__actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrar}
                  disabled={guardando}
                >
                  <XCircle size={16} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={guardando}
                >
                  <Save size={16} />
                  {guardando
                    ? "Guardando..."
                    : esEdicion
                      ? "Guardar cambios"
                      : "Crear rol"}
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

export default FormularioRol;
