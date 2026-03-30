import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CrearPrendas.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import { obtenerTiposPrendaActivosService } from "../../services/tipo_prendas";
import { obtenerTiposMedidaPorPrenda } from "../../services/tipoMedidasService";
import { obtenerUnidadesMedidaService } from "../../services/unidadesService";
import { obtenerMaterialesActivosService } from "../../services/materiales";
import {
  obtenerPrendaPorId,
  subirImagenesPrendaService,
  updatePrendas,
} from "../../services/Prendas";
import {
  obtenerImagenesPrenda,
  obtenerImagenActualPrenda,
  cambiarImagenPrenda,
} from "../../utils/Imagenes";

const MAX_IMAGENES = 3;

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
  imagenesExistentes: [],
  imagenesNuevas: [],
  medidas: [crearMedidaVacia()],
  materiales: [crearMaterialVacio()],
});

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const obtenerDetallePrenda = (data) => {
  const detalle = data?.data ?? data?.prenda ?? data;
  if (Array.isArray(detalle)) return detalle[0] || {};
  return detalle || {};
};

const filaMedidaVacia = (item) =>
  !item.tipo_medida_id && !item.unidad_id && item.valor === "";

const filaMaterialVacia = (item) =>
  !item.material_id &&
  !item.unidad_id &&
  item.cantidad === "" &&
  !item.observacion?.trim();

const extraerNombreArchivo = (url = "") => {
  try {
    return decodeURIComponent(String(url).split("/").pop() || "imagen");
  } catch {
    return String(url).split("/").pop() || "imagen";
  }
};

const mapearImagenesExistentes = (detalle) => {
  const lista = obtenerImagenesPrenda(detalle).slice(0, MAX_IMAGENES);

  return lista.map((url) => ({
    nombre: extraerNombreArchivo(url),
    vista: url,
    valor: url,
  }));
};

const mapearMedidasExistentes = (detalle) => {
  const posibles =
    detalle?.medidas ||
    detalle?.cliente_prenda_medidas ||
    detalle?.detalle_medidas ||
    [];

  const lista = normalizarRespuesta(posibles);

  if (lista.length === 0) return [crearMedidaVacia()];

  return lista.map((item) => ({
    tipo_medida_id: String(item.tipo_medida_id ?? item.tipoMedidaId ?? ""),
    unidad_id: String(item.unidad_id ?? item.unidadMedidaId ?? ""),
    valor: String(item.valor ?? item.medida ?? ""),
  }));
};

const mapearMaterialesExistentes = (detalle) => {
  const posibles =
    detalle?.materiales ||
    detalle?.cliente_prenda_material ||
    detalle?.detalle_materiales ||
    [];

  const lista = normalizarRespuesta(posibles);

  if (lista.length === 0) return [crearMaterialVacio()];

  return lista.map((item) => ({
    material_id: String(item.material_id ?? item.materialId ?? ""),
    unidad_id: String(item.unidad_id ?? item.unidadMedidaId ?? ""),
    cantidad: String(item.cantidad ?? ""),
    observacion: String(item.observaciones ?? item.observacion ?? ""),
  }));
};

function EditarPrendas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(crearEstadoInicial());
  const [previewImagenesNuevas, setPreviewImagenesNuevas] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  const [clientes, setClientes] = useState([]);
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [tiposMedidaDisponibles, setTiposMedidaDisponibles] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [materialesCatalogo, setMaterialesCatalogo] = useState([]);

  const [loadingInicial, setLoadingInicial] = useState(false);
  const [loadingMedidas, setLoadingMedidas] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorCarga, setErrorCarga] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  const tituloLimpio = useMemo(() => form.titulo.trim(), [form.titulo]);

  const totalImagenes = useMemo(
    () => form.imagenesExistentes.length + form.imagenesNuevas.length,
    [form.imagenesExistentes.length, form.imagenesNuevas.length]
  );

  const obtenerIdPrendaActual = () => Number(id);

  const obtenerPrendaTemporalConImagenes = () => ({
    cliente_prenda_id: obtenerIdPrendaActual(),
    imagenes: form.imagenesExistentes.map((img) => ({
      url_img: img.valor,
    })),
  });

  const imagenesExistentesLista = useMemo(() => {
    return obtenerImagenesPrenda(obtenerPrendaTemporalConImagenes());
  }, [form.imagenesExistentes, id]);

  const imagenActualExistente = useMemo(() => {
    if (imagenesExistentesLista.length === 0) return "";

    return obtenerImagenActualPrenda(
      obtenerPrendaTemporalConImagenes(),
      imageIndexes,
      () => obtenerIdPrendaActual()
    );
  }, [imagenesExistentesLista, imageIndexes, form.imagenesExistentes, id]);

  const indiceActualImagenExistente = useMemo(() => {
    return imageIndexes[Number(id)] || 0;
  }, [imageIndexes, id]);

  const cambiarImagenExistente = (direction) => {
    cambiarImagenPrenda(
      obtenerIdPrendaActual(),
      imagenesExistentesLista.length,
      direction,
      setImageIndexes
    );
  };

  useEffect(() => {
    const previews = form.imagenesNuevas.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreviewImagenesNuevas(previews);

    return () => {
      previews.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [form.imagenesNuevas]);

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

  const llenarFormulario = async (detalle) => {
    const tipoPrendaId = String(
      detalle.tipo_prenda_id ?? detalle.tipo_prendas_id ?? detalle.tipoPrendaId ?? ""
    );

    setForm({
      cliente_id: String(detalle.cliente_id ?? ""),
      tipo_prenda_id: tipoPrendaId,
      titulo: String(detalle.titulo ?? ""),
      imagenesExistentes: mapearImagenesExistentes(detalle),
      imagenesNuevas: [],
      medidas: mapearMedidasExistentes(detalle),
      materiales: mapearMaterialesExistentes(detalle),
    });

    setImageIndexes((prev) => ({
      ...prev,
      [Number(id)]: 0,
    }));

    if (tipoPrendaId) {
      await cargarMedidasPorPrenda(tipoPrendaId);
    } else {
      setTiposMedidaDisponibles([]);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoadingInicial(true);
      setErrorCarga("");

      const [
        clientesResp,
        tiposPrendaResp,
        unidadesResp,
        materialesResp,
        detalleResp,
      ] = await Promise.all([
        obtenerClientesActivosService(),
        obtenerTiposPrendaActivosService(),
        obtenerUnidadesMedidaService(),
        obtenerMaterialesActivosService(),
        obtenerPrendaPorId(id),
      ]);

      setClientes(normalizarRespuesta(clientesResp));
      setTiposPrenda(normalizarRespuesta(tiposPrendaResp));
      setUnidadesMedida(normalizarRespuesta(unidadesResp));
      setMaterialesCatalogo(normalizarRespuesta(materialesResp));

      const detalle = obtenerDetallePrenda(detalleResp);
      await llenarFormulario(detalle);
    } catch (error) {
      console.error("Error al cargar prenda:", error);
      setErrorCarga("No se pudo cargar la información de la prenda.");
    } finally {
      setLoadingInicial(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    cargarDatos();
  }, [id]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "tipo_prenda_id") {
      setForm((prev) => ({
        ...prev,
        tipo_prenda_id: value,
        medidas: [crearMedidaVacia()],
      }));

      await cargarMedidasPorPrenda(value);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorFormulario("");
  };

  const handleImagenesChange = (e) => {
    const archivos = Array.from(e.target.files || []);
    const espaciosDisponibles = MAX_IMAGENES - totalImagenes;

    if (espaciosDisponibles <= 0) {
      e.target.value = "";
      return;
    }

    const archivosPermitidos = archivos.slice(0, espaciosDisponibles);

    setForm((prev) => ({
      ...prev,
      imagenesNuevas: [...prev.imagenesNuevas, ...archivosPermitidos],
    }));

    e.target.value = "";
  };

  const eliminarImagen = (tipo, index) => {
    if (tipo === "existente") {
      setForm((prev) => {
        const actualizadas = prev.imagenesExistentes.filter((_, i) => i !== index);

        setImageIndexes((prevIndexes) => {
          const currentIndex = prevIndexes[Number(id)] || 0;
          const nuevoIndex =
            actualizadas.length === 0
              ? 0
              : Math.min(currentIndex, actualizadas.length - 1);

          return {
            ...prevIndexes,
            [Number(id)]: nuevoIndex,
          };
        });

        return {
          ...prev,
          imagenesExistentes: actualizadas,
        };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      imagenesNuevas: prev.imagenesNuevas.filter((_, i) => i !== index),
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

      if (!material.material_id || !material.unidad_id || material.cantidad === "") {
        return "Cada material debe estar completo: material, unidad y cantidad.";
      }
    }

    if (totalImagenes > MAX_IMAGENES) {
      return "Solo puedes manejar un máximo de 3 imágenes.";
    }

    return "";
  };

  const subirImagenesNuevasSiExisten = async () => {
    if (!form.imagenesNuevas.length) return [];

    const response = await subirImagenesPrendaService(form.imagenesNuevas);

    if (!response?.imagenes || !Array.isArray(response.imagenes)) {
      throw new Error("La respuesta de imágenes no tiene el formato esperado.");
    }

    return response.imagenes.map((img) => img.url);
  };

  const construirPayload = (imagenesSubidas = []) => ({
    cliente_id: Number(form.cliente_id),
    tipo_prenda_id: Number(form.tipo_prenda_id),
    titulo: tituloLimpio,
    usuario_creador: 1,
    imagenes: [
      ...form.imagenesExistentes.map((img) => img.valor),
      ...imagenesSubidas,
    ].slice(0, MAX_IMAGENES),
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
  });

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

      const imagenesSubidas = await subirImagenesNuevasSiExisten();
      const payload = construirPayload(imagenesSubidas);

      await updatePrendas(id, payload);
      navigate("/home/prendas");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrorFormulario(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo actualizar la prenda."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="crear-prenda-modal" style={{ padding: "24px" }}>
      <div className="crear-prenda-modal__content">
        <div className="crear-prenda-modal__header">
          <div className="crear-prenda-modal__header-left">
            <div className="crear-prenda-modal__badge">Editar prenda</div>
            <h2 className="crear-prenda-modal__title">Actualizar prenda</h2>
            <p className="crear-prenda-modal__subtitle">
              Modifica información general, imágenes, medidas y materiales de la prenda.
            </p>
          </div>

          <button
            type="button"
            className="crear-prenda-modal__close"
            onClick={() => navigate("/home/prendas")}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {loadingInicial && (
          <div className="crear-prenda-form__empty">
            Cargando información de la prenda...
          </div>
        )}

        {!loadingInicial && errorCarga && (
          <div className="crear-prenda-form__empty">{errorCarga}</div>
        )}

        {!loadingInicial && !errorCarga && (
          <form onSubmit={handleSubmit} className="crear-prenda-form">
            {errorFormulario && (
              <div className="crear-prenda-form__alert">{errorFormulario}</div>
            )}

            <section className="crear-prenda-form__section">
              <div className="crear-prenda-form__section-header">
                <div>
                  <h3>Información general</h3>
                  <p>Actualiza los datos principales de la prenda.</p>
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
                  <p>
                    Puedes conservar imágenes actuales, quitar algunas o agregar nuevas.
                  </p>
                </div>
                <span className="crear-prenda-form__counter">{totalImagenes} / 3</span>
              </div>

              <div className="crear-prenda-form__upload-box">
                <label className="crear-prenda-form__upload-button">
                  Agregar imágenes
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagenesChange}
                    hidden
                    disabled={saving || totalImagenes >= MAX_IMAGENES}
                  />
                </label>

                <p className="crear-prenda-form__upload-help">
                  Se mantendrán las imágenes existentes que no elimines.
                </p>
              </div>

              <div className="crear-prenda-form__images-grid">
                {imagenesExistentesLista.length > 0 && (
                  <div className="crear-prenda-form__image-card">
                    <div className="crear-prenda-form__image-frame">
                      <img
                        src={imagenActualExistente}
                        alt="Imagen actual de la prenda"
                      />
                    </div>

                    <div className="crear-prenda-form__image-info">
                      <span>
                        Imagen actual ({indiceActualImagenExistente + 1} /{" "}
                        {imagenesExistentesLista.length})
                      </span>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {imagenesExistentesLista.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarImagenExistente("prev")}
                              disabled={saving}
                            >
                              ‹
                            </button>

                            <button
                              type="button"
                              onClick={() => cambiarImagenExistente("next")}
                              disabled={saving}
                            >
                              ›
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            eliminarImagen("existente", indiceActualImagenExistente)
                          }
                          disabled={saving}
                        >
                          Quitar actual
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {previewImagenesNuevas.map((imagen, index) => (
                  <div
                    key={`nueva-${imagen.nombre}-${index}`}
                    className="crear-prenda-form__image-card"
                  >
                    <div className="crear-prenda-form__image-frame">
                      <img src={imagen.url} alt={imagen.nombre} />
                    </div>

                    <div className="crear-prenda-form__image-info">
                      <span title={imagen.nombre}>{imagen.nombre} (nueva)</span>
                      <button
                        type="button"
                        onClick={() => eliminarImagen("nueva", index)}
                        disabled={saving}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}

                {imagenesExistentesLista.length === 0 &&
                  previewImagenesNuevas.length === 0 && (
                    <div className="crear-prenda-form__empty crear-prenda-form__empty--soft">
                      No hay imágenes disponibles.
                    </div>
                  )}
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
                      <p>Actualiza los materiales necesarios para la confección.</p>
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
                onClick={() => navigate("/home/prendas")}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="crear-prenda-form__button crear-prenda-form__button--save"
                disabled={saving}
              >
                {saving ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditarPrendas;