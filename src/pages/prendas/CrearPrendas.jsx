import React, { useEffect, useMemo, useState } from "react";
import "./CrearPrendas.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import { obtenerTiposPrendaActivosService } from "../../services/tipo_prendas";
import { obtenerTiposMedidaPorPrenda } from "../../services/tipoMedidasService";
import { obtenerUnidadesMedidaService } from "../../services/unidadesService";
import { obtenerMaterialesActivosService } from "../../services/materiales";
import { subirImagenesPrendaService, crearPrendas } from "../../services/Prendas";

const crearMedidaVacia = () => ({
  tipo_medida_id: "",
  unidad_id: "",
  valor: "",
});

const crearMaterialVacio = () => ({
  material_id: "",
  unidad_id: "",
  cantidad: "",
  observacion: "",
});

const crearEstadoInicial = () => ({
  cliente_id: "",
  tipo_prenda_id: "",
  titulo: "",
  imagenes: [],
  medidas: [crearMedidaVacia()],
  materiales: [crearMaterialVacio()],
});

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const filaMedidaVacia = (item) =>
  !item.tipo_medida_id && !item.unidad_id && item.valor === "";

const filaMaterialVacia = (item) =>
  !item.material_id &&
  item.cantidad === "" &&
  !item.observacion?.trim();

function CrearPrendas({ open, onClose, onCreado }) {
  const [form, setForm] = useState(crearEstadoInicial());
  const [previewImagenes, setPreviewImagenes] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [tiposMedidaDisponibles, setTiposMedidaDisponibles] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [materialesCatalogo, setMaterialesCatalogo] = useState([]);

  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [loadingMedidas, setLoadingMedidas] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorCatalogos, setErrorCatalogos] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  const tituloLimpio = useMemo(() => form.titulo.trim(), [form.titulo]);

  const clienteSeleccionado = useMemo(
    () => clientes.find((item) => String(item.cliente_id) === String(form.cliente_id)),
    [clientes, form.cliente_id]
  );

  const tipoPrendaSeleccionado = useMemo(
    () =>
      tiposPrenda.find(
        (item) => String(item.tipo_prendas_id) === String(form.tipo_prenda_id)
      ),
    [tiposPrenda, form.tipo_prenda_id]
  );

  const resetFormulario = () => {
    setForm(crearEstadoInicial());
    setPreviewImagenes([]);
    setTiposMedidaDisponibles([]);
    setErrorFormulario("");
    setErrorCatalogos("");
  };

  const cargarCatalogosBase = async () => {
    try {
      setLoadingCatalogos(true);
      setErrorCatalogos("");

      const [clientesResp, tiposPrendaResp, unidadesResp, materialesResp] =
        await Promise.all([
          obtenerClientesActivosService(),
          obtenerTiposPrendaActivosService(),
          obtenerUnidadesMedidaService(),
          obtenerMaterialesActivosService(),
        ]);

      setClientes(normalizarRespuesta(clientesResp));
      setTiposPrenda(normalizarRespuesta(tiposPrendaResp));
      setUnidadesMedida(normalizarRespuesta(unidadesResp));
      setMaterialesCatalogo(normalizarRespuesta(materialesResp));
    } catch (error) {
      console.error("Error al cargar catálogos base:", error);
      setErrorCatalogos("No se pudo cargar la información del formulario.");
    } finally {
      setLoadingCatalogos(false);
    }
  };

  const cargarMedidasPorPrenda = async (tipoPrendaId) => {
    try {
      setLoadingMedidas(true);

      if (!tipoPrendaId) {
        setTiposMedidaDisponibles([]);
        return;
      }

      const response = await obtenerTiposMedidaPorPrenda(tipoPrendaId);
      setTiposMedidaDisponibles(normalizarRespuesta(response));
    } catch (error) {
      console.error("Error al cargar medidas por prenda:", error);
      setTiposMedidaDisponibles([]);
    } finally {
      setLoadingMedidas(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    resetFormulario();
    cargarCatalogosBase();
  }, [open]);

  useEffect(() => {
    const previews = form.imagenes.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreviewImagenes(previews);

    return () => {
      previews.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [form.imagenes]);

  if (!open) return null;

  const actualizarCampoForm = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "tipo_prenda_id") {
      actualizarCampoForm("tipo_prenda_id", value);
      setForm((prev) => ({
        ...prev,
        tipo_prenda_id: value,
        medidas: [crearMedidaVacia()],
      }));
      setErrorFormulario("");
      await cargarMedidasPorPrenda(value);
      return;
    }

    actualizarCampoForm(name, value);
    setErrorFormulario("");
  };

  const handleImagenesChange = (e) => {
    const archivos = Array.from(e.target.files || []);
    const maximo = 3;

    const nuevasImagenes = [...form.imagenes, ...archivos].slice(0, maximo);

    setForm((prev) => ({
      ...prev,
      imagenes: nuevasImagenes,
    }));

    e.target.value = "";
  };

  const eliminarImagen = (index) => {
    setForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const agregarMedida = () => {
    if (!form.tipo_prenda_id) {
      setErrorFormulario("Primero debes seleccionar el tipo de prenda.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      medidas: [...prev.medidas, crearMedidaVacia()],
    }));
  };

  const eliminarMedida = (index) => {
    setForm((prev) => ({
      ...prev,
      medidas:
        prev.medidas.length === 1
          ? [crearMedidaVacia()]
          : prev.medidas.filter((_, i) => i !== index),
    }));
  };

  const cambiarMedida = (index, campo, valor) => {
    setForm((prev) => ({
      ...prev,
      medidas: prev.medidas.map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      ),
    }));
    setErrorFormulario("");
  };

  const agregarMaterial = () => {
    setForm((prev) => ({
      ...prev,
      materiales: [...prev.materiales, crearMaterialVacio()],
    }));
  };

  const eliminarMaterial = (index) => {
    setForm((prev) => ({
      ...prev,
      materiales:
        prev.materiales.length === 1
          ? [crearMaterialVacio()]
          : prev.materiales.filter((_, i) => i !== index),
    }));
  };

  const cambiarMaterial = (index, campo, valor) => {
    setForm((prev) => ({
      ...prev,
      materiales: prev.materiales.map((item, i) =>
        i === index ? { ...item, [campo]: valor } : item
      ),
    }));
    setErrorFormulario("");
  };

  const validarFormulario = () => {
    if (!tituloLimpio) {
      return "El título es obligatorio.";
    }

    if (!form.cliente_id) {
      return "Debes seleccionar un cliente.";
    }

    if (!form.tipo_prenda_id) {
      return "Debes seleccionar un tipo de prenda.";
    }

    for (const medida of form.medidas) {
      if (filaMedidaVacia(medida)) continue;

      if (!medida.tipo_medida_id || !medida.unidad_id || medida.valor === "") {
        return "Cada medida debe estar completa: tipo de medida, unidad y valor.";
      }
    }

    for (const material of form.materiales) {
      if (filaMaterialVacia(material)) continue;

      if (!material.material_id || material.cantidad === "") {
        return "Cada material debe estar completo: material, cantidad.";
      }
    }

    return "";
  };

  const subirImagenesSiExisten = async () => {
    if (!form.imagenes || form.imagenes.length === 0) {
      return [];
    }

    const response = await subirImagenesPrendaService(form.imagenes);

    if (!response?.imagenes || !Array.isArray(response.imagenes)) {
      throw new Error("La respuesta de imágenes no tiene el formato esperado.");
    }

    return response.imagenes.map((img) => img.url);
  };

  const construirPayload = (imagenesSubidas = []) => {
    return {
      cliente_id: Number(form.cliente_id),
      tipo_prenda_id: Number(form.tipo_prenda_id),
      titulo: tituloLimpio,
      usuario_creador: 1,
      imagenes: imagenesSubidas,
      medidas: form.medidas
        .filter((item) => !filaMedidaVacia(item))
        .map((item) => ({
          tipo_medida_id: Number(item.tipo_medida_id),
          unidad_id: Number(item.unidad_id),
          valor: Number(item.valor),
        })),
      materiales: form.materiales
        .filter((item) => !filaMaterialVacia(item))
        .map((item) => ({
          material_id: Number(item.material_id),
          unidad_id: Number(item.unidad_id),
          cantidad: Number(item.cantidad),
          observacion: item.observacion?.trim() || "",
        })),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validarFormulario();
    if (error) {
      setErrorFormulario(error);
      return;
    }

    try {
      setSaving(true);
      setErrorFormulario("");

      const imagenesSubidas = await subirImagenesSiExisten();
      const payload = construirPayload(imagenesSubidas);

      const response = await crearPrendas(payload);

      if (onCreado) {
        onCreado(response);
      }

      resetFormulario();
      onClose();
    } catch (error) {
      console.error("Error al guardar la prenda:", error);
      setErrorFormulario(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo guardar la prenda."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("crear-prenda-modal")) {
      onClose();
    }
  };

  return (
    <div className="crear-prenda-modal" onClick={handleOverlayClick}>
      <div className="crear-prenda-modal__content">
        <div className="crear-prenda-modal__header">
          <div className="crear-prenda-modal__header-left">
            <div className="crear-prenda-modal__badge">Nueva prenda</div>
            <h2 className="crear-prenda-modal__title">Crear prenda</h2>
            <p className="crear-prenda-modal__subtitle">
              Registra información general, imágenes de referencia, medidas y materiales.
            </p>
          </div>

          <button
            type="button"
            className="crear-prenda-modal__close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {!loadingCatalogos && !errorCatalogos && (
          <div className="crear-prenda-resumen">
            <div className="crear-prenda-resumen__item">
              <span className="crear-prenda-resumen__label">Imágenes</span>
              <strong>{form.imagenes.length}/3</strong>
            </div>
            <div className="crear-prenda-resumen__item">
              <span className="crear-prenda-resumen__label">Cliente</span>
              <strong>
                {clienteSeleccionado
                  ? `${clienteSeleccionado.nombre_cliente} ${clienteSeleccionado.apellido_cliente}`
                  : "Sin seleccionar"}
              </strong>
            </div>
            <div className="crear-prenda-resumen__item">
              <span className="crear-prenda-resumen__label">Tipo</span>
              <strong>{tipoPrendaSeleccionado?.nombre || "Sin seleccionar"}</strong>
            </div>
            <div className="crear-prenda-resumen__item">
              <span className="crear-prenda-resumen__label">Medidas</span>
              <strong>{form.medidas.length}</strong>
            </div>
            <div className="crear-prenda-resumen__item">
              <span className="crear-prenda-resumen__label">Materiales</span>
              <strong>{form.materiales.length}</strong>
            </div>
          </div>
        )}

        {loadingCatalogos && (
          <div className="crear-prenda-form__empty">
            Cargando información del formulario...
          </div>
        )}

        {!loadingCatalogos && errorCatalogos && (
          <div className="crear-prenda-form__empty">{errorCatalogos}</div>
        )}

        {!loadingCatalogos && !errorCatalogos && (
          <form onSubmit={handleSubmit} className="crear-prenda-form">
            {errorFormulario && (
              <div className="crear-prenda-form__alert">{errorFormulario}</div>
            )}

            <section className="crear-prenda-form__section">
              <div className="crear-prenda-form__section-header">
                <div>
                  <h3>Información general</h3>
                  <p>Completa los datos principales de la prenda.</p>
                </div>
              </div>

              <div className="crear-prenda-form__grid crear-prenda-form__grid--top">
                <div className="crear-prenda-form__group crear-prenda-form__group--full">
                  <label>Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Ej. Vestido formal, Traje ejecutivo, Blusa casual"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="crear-prenda-form__group">
                  <label>Cliente</label>
                  <select
                    name="cliente_id"
                    value={form.cliente_id}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.cliente_id} value={cliente.cliente_id}>
                        {cliente.nombre_cliente} {cliente.apellido_cliente}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="crear-prenda-form__group">
                  <label>Tipo de prenda</label>
                  <select
                    name="tipo_prenda_id"
                    value={form.tipo_prenda_id}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  >
                    <option value="">Seleccione un tipo de prenda</option>
                    {tiposPrenda.map((tipo) => (
                      <option key={tipo.tipo_prendas_id} value={tipo.tipo_prendas_id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="crear-prenda-form__section">
              <div className="crear-prenda-form__section-header">
                <div>
                  <h3>Imágenes de referencia</h3>
                  <p>Sube hasta 3 imágenes. Ahora se mostrarán completas.</p>
                </div>
                <span className="crear-prenda-form__counter">
                  {form.imagenes.length} / 3
                </span>
              </div>

              <div className="crear-prenda-form__upload-box">
                <label className="crear-prenda-form__upload-button">
                  Seleccionar imágenes
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagenesChange}
                    hidden
                    disabled={saving || form.imagenes.length >= 3}
                  />
                </label>

                <p className="crear-prenda-form__upload-help">
                  Formatos sugeridos: JPG, PNG o WEBP.
                </p>
              </div>

              <div className="crear-prenda-form__images-grid">
                {previewImagenes.length === 0 && (
                  <div className="crear-prenda-form__empty crear-prenda-form__empty--soft">
                    No hay imágenes seleccionadas.
                  </div>
                )}

                {previewImagenes.map((imagen, index) => (
                  <div
                    key={`${imagen.nombre}-${index}`}
                    className="crear-prenda-form__image-card"
                  >
                    <div className="crear-prenda-form__image-frame">
                      <img src={imagen.url} alt={imagen.nombre} />
                    </div>

                    <div className="crear-prenda-form__image-info">
                      <span title={imagen.nombre}>{imagen.nombre}</span>
                      <button
                        type="button"
                        onClick={() => eliminarImagen(index)}
                        disabled={saving}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="crear-prenda-form__section">
              <div className="crear-prenda-form__split">
                <div className="crear-prenda-form__panel">
                  <div className="crear-prenda-form__panel-header">
                    <div>
                      <h3>Medidas</h3>
                      <p>
                        {form.tipo_prenda_id
                          ? "Estas medidas corresponden a la prenda seleccionada."
                          : "Selecciona un tipo de prenda para cargar sus medidas."}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="crear-prenda-form__mini-button"
                      onClick={agregarMedida}
                      disabled={!form.tipo_prenda_id || saving || loadingMedidas}
                    >
                      + Agregar
                    </button>
                  </div>

                  {loadingMedidas && (
                    <div className="crear-prenda-form__empty">Cargando medidas...</div>
                  )}

                  {!loadingMedidas && (
                    <div className="crear-prenda-form__dynamic-list">
                      {form.medidas.map((medida, index) => (
                        <div key={index} className="crear-prenda-form__dynamic-card">
                          <div className="crear-prenda-form__card-number">
                            Medida #{index + 1}
                          </div>

                          <div className="crear-prenda-form__dynamic-grid">
                            <div className="crear-prenda-form__group">
                              <label>Tipo de medida</label>
                              <select
                                value={medida.tipo_medida_id}
                                onChange={(e) =>
                                  cambiarMedida(index, "tipo_medida_id", e.target.value)
                                }
                                disabled={!form.tipo_prenda_id || saving}
                              >
                                <option value="">
                                  {form.tipo_prenda_id
                                    ? "Seleccione"
                                    : "Seleccione una prenda primero"}
                                </option>

                                {tiposMedidaDisponibles.map((item) => (
                                  <option
                                    key={item.tipo_medida_id}
                                    value={item.tipo_medida_id}
                                  >
                                    {item.nombre_tipo_medida}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="crear-prenda-form__group">
                              <label>Unidad</label>
                              <select
                                value={medida.unidad_id}
                                onChange={(e) =>
                                  cambiarMedida(index, "unidad_id", e.target.value)
                                }
                                disabled={saving}
                              >
                                <option value="">Seleccione</option>
                                {unidadesMedida.map((item) => (
                                  <option key={item.unidad_id} value={item.unidad_id}>
                                    {item.nombre_unidad} ({item.simbolo_unidad})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="crear-prenda-form__group crear-prenda-form__group--full-mobile">
                              <label>Valor</label>
                              <input
                                type="number"
                                step="0.01"
                                value={medida.valor}
                                onChange={(e) =>
                                  cambiarMedida(index, "valor", e.target.value)
                                }
                                placeholder="Ej. 34.5"
                                disabled={saving}
                              />
                            </div>
                          </div>

                          <div className="crear-prenda-form__dynamic-actions">
                            <button
                              type="button"
                              className="crear-prenda-form__remove-button"
                              onClick={() => eliminarMedida(index)}
                              disabled={saving}
                            >
                              Quitar medida
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="crear-prenda-form__panel">
                  <div className="crear-prenda-form__panel-header">
                    <div>
                      <h3>Materiales</h3>
                      <p>Agrega los materiales necesarios para la confección.</p>
                    </div>

                    <button
                      type="button"
                      className="crear-prenda-form__mini-button"
                      onClick={agregarMaterial}
                      disabled={saving}
                    >
                      + Agregar
                    </button>
                  </div>

                  <div className="crear-prenda-form__dynamic-list">
                    {form.materiales.map((material, index) => (
                      <div key={index} className="crear-prenda-form__dynamic-card">
                        <div className="crear-prenda-form__card-number">
                          Material #{index + 1}
                        </div>

                        <div className="crear-prenda-form__dynamic-grid crear-prenda-form__dynamic-grid--materials">
                          <div className="crear-prenda-form__group">
                            <label>Material</label>
                            <select
                              value={material.material_id}
                              onChange={(e) =>
                                cambiarMaterial(index, "material_id", e.target.value)
                              }
                              disabled={saving}
                            >
                              <option value="">Seleccione</option>
                              {materialesCatalogo.map((item) => (
                                <option key={item.material_id} value={item.material_id}>
                                  {item.nombre_material}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="crear-prenda-form__group">
                            <label>Unidad</label>
                            <select
                              value={material.unidad_id}
                              onChange={(e) =>
                                cambiarMaterial(index, "unidad_id", e.target.value)
                              }
                              disabled={saving}
                            >
                              <option value="">Seleccione</option>
                              {unidadesMedida.map((item) => (
                                <option key={item.unidad_id} value={item.unidad_id}>
                                  {item.nombre_unidad} ({item.simbolo_unidad})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="crear-prenda-form__group">
                            <label>Cantidad</label>
                            <input
                              type="number"
                              step="0.01"
                              value={material.cantidad}
                              onChange={(e) =>
                                cambiarMaterial(index, "cantidad", e.target.value)
                              }
                              placeholder="Ej. 2"
                              disabled={saving}
                            />
                          </div>

                          <div className="crear-prenda-form__group crear-prenda-form__group--full">
                            <label>Observación</label>
                            <input
                              type="text"
                              value={material.observacion}
                              onChange={(e) =>
                                cambiarMaterial(index, "observacion", e.target.value)
                              }
                              placeholder="Ej. Tela principal, botones dorados, cierre invisible"
                              disabled={saving}
                            />
                          </div>
                        </div>

                        <div className="crear-prenda-form__dynamic-actions">
                          <button
                            type="button"
                            className="crear-prenda-form__remove-button"
                            onClick={() => eliminarMaterial(index)}
                            disabled={saving}
                          >
                            Quitar material
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="crear-prenda-form__footer">
              <button
                type="button"
                className="crear-prenda-form__button crear-prenda-form__button--cancel"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="crear-prenda-form__button crear-prenda-form__button--save"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar prenda"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CrearPrendas;