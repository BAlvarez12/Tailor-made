import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PrendaFormulario.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import { obtenerTiposPrendaActivosService } from "../../services/tipoPrendasService";
import { obtenerMaterialesActivosService } from "../../services/materialesService";
import {
  obtenerPrendaPorId,
  subirImagenesPrendaService,
  crearPrendas,
  updatePrendas,
} from "../../services/prendasService";
import { obtenerMedidasPorCliente } from "../../services/prendasService";
import { construirUrlImagenPrenda } from "../../utils/Imagenes";
import ModalMedidas from "../clientes/ModalMedidas";
import { Save, XCircle, X, Plus, Minus, Check, Edit3, Ruler, Scissors, PencilRuler, Tag, Search, User } from "lucide-react";

const MAX_IMAGENES = 3;

const obtenerTelefonoCliente = (cliente) => {
  if (!cliente) return "";
  return String(
    cliente.telefono ??
      cliente.Telefono ??
      cliente.numero_telefono ??
      cliente.telefono_cliente ??
      ""
  ).trim();
};

const normalizarCliente = (cliente) => ({
  ...cliente,
  nombre_cliente: cliente.nombre_cliente ?? cliente.nombre ?? "",
  apellido_cliente: cliente.apellido_cliente ?? cliente.apellido ?? "",
  telefono: obtenerTelefonoCliente(cliente),
});

const formatearNombreCliente = (cliente) => {
  if (!cliente) return "";
  return `${cliente.nombre_cliente || ""} ${cliente.apellido_cliente || ""}`.trim();
};

const formatearClienteDisplay = (cliente) => {
  const nombre = formatearNombreCliente(cliente);
  const telefono = obtenerTelefonoCliente(cliente);

  if (nombre && telefono) return `${nombre} · ${telefono}`;
  return nombre || telefono;
};

const normalizarTelefono = (valor = "") => String(valor).replace(/\D/g, "");

const clienteCoincideBusqueda = (cliente, texto) => {
  if (!texto) return true;

  const nombreCompleto = formatearNombreCliente(cliente).toLowerCase();
  const telefono = obtenerTelefonoCliente(cliente).toLowerCase();
  const telefonoDigitos = normalizarTelefono(telefono);
  const textoDigitos = normalizarTelefono(texto);

  return (
    nombreCompleto.includes(texto) ||
    telefono.includes(texto) ||
    (textoDigitos.length > 0 && telefonoDigitos.includes(textoDigitos))
  );
};

const normalizarTipoPrenda = (tipo) => ({
  ...tipo,
  tipo_prendas_id: String(
    tipo.tipo_prendas_id ?? tipo.tipo_prenda_id ?? tipo.id ?? ""
  ),
  nombre: String(tipo.nombre ?? tipo.nombre_tipo_prenda ?? "").trim(),
});

const formatearTipoPrendaDisplay = (tipo) =>
  tipo ? normalizarTipoPrenda(tipo).nombre : "";

const tipoPrendaCoincideBusqueda = (tipo, texto) => {
  if (!texto) return true;
  return normalizarTipoPrenda(tipo).nombre.toLowerCase().includes(texto);
};

const crearEstadoInicial = () => ({
  cliente_id: "",
  tipo_prenda_id: "",
  titulo: "",
  imagenesExistentes: [],
  imagenesNuevas: [],
  medidas: [],
  materiales: [],
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

const extraerNombreArchivo = (url = "") => {
  try {
    return decodeURIComponent(String(url).split("/").pop() || "imagen");
  } catch {
    return String(url).split("/").pop() || "imagen";
  }
};

const mapearImagenesExistentes = (detalle) => {
  const lista =
    detalle?.cliente_prenda_img ||
    detalle?.imagenes ||
    [];

  if (!Array.isArray(lista)) return [];

  return lista
    .map((img) => {
      const url = typeof img === 'string' ? img : (img?.url_img || img?.url || '');
      if (!url || typeof url !== 'string') return null;
      return {
        nombre: extraerNombreArchivo(url),
        vista: construirUrlImagenPrenda(url),
        valor: url,
      };
    })
    .filter(Boolean)
    .slice(0, MAX_IMAGENES);
};

const normalizarMedidaCliente = (item) => ({
  cliente_medida_id: String(item.cliente_medida_id ?? ""),
  tipo_medida_id: String(item.tipo_medida_id ?? item.tipoMedidaId ?? ""),
  unidad_id: String(item.unidad_id ?? item.unidadMedidaId ?? ""),
  valor: String(item.valor ?? item.medida ?? ""),
  nombre_tipo_medida: String(item.nombre_tipo_medida ?? item.nombre ?? "Medida"),
  nombre_unidad: String(item.nombre_unidad ?? ""),
  simbolo_unidad: String(item.simbolo_unidad ?? ""),
});

const obtenerKeyMedida = (item) =>
  String(
    item.cliente_medida_id ||
      item.tipo_medida_id ||
      `${item.tipo_medida_id}-${item.unidad_id}-${item.valor}`
  );

const mapearMedidasExistentes = (detalle) => {
  const posibles =
    detalle?.medidas ||
    detalle?.cliente_prenda_medidas ||
    detalle?.detalle_medidas ||
    [];

  const lista = normalizarRespuesta(posibles);

  if (lista.length === 0) return [];

  return lista.map((item) =>
    normalizarMedidaCliente({
      cliente_medida_id: item.cliente_medida_id,
      tipo_medida_id: item.tipo_medida_id ?? item.tipoMedidaId,
      unidad_id: item.unidad_id ?? item.unidadMedidaId,
      valor: item.valor ?? item.medida,
      nombre_tipo_medida: item.nombre_tipo_medida ?? item.nombre,
      nombre_unidad: item.nombre_unidad,
      simbolo_unidad: item.simbolo_unidad,
    })
  );
};

const normalizarMaterialCatalogo = (item) => ({
  material_id: String(item.material_id ?? item.materialId ?? ""),
  nombre_material: String(item.nombre_material ?? item.nombre ?? "Material"),
  unidad_label: String(
    item.unidad_label ??
      item.unidad ??
      item.simbolo_unidad ??
      item.nombre_unidad ??
      ""
  ),
});

const mapearMaterialesExistentes = (detalle, catalogo = []) => {
  const posibles =
    detalle?.materiales ||
    detalle?.cliente_prenda_material ||
    detalle?.detalle_materiales ||
    [];

  const lista = normalizarRespuesta(posibles);

  if (lista.length === 0) return [];

  return lista.map((item) => {
    const materialId = String(item.material_id ?? item.materialId ?? "");
    const encontrado = catalogo.find(
      (mat) => String(mat.material_id) === materialId
    );

    return {
      material_id: materialId,
      nombre_material: String(
        item.nombre_material ?? encontrado?.nombre_material ?? "Material"
      ),
      unidad_label: String(
        item.unidad_label ??
          item.simbolo_unidad ??
          item.nombre_unidad ??
          encontrado?.unidad_label ??
          ""
      ),
      cantidad: Number(item.cantidad ?? 1),
      observacion: String(item.observaciones ?? item.observacion ?? ""),
    };
  });
};

function PrendaFormulario({
  open,
  mode = "create",
  prendaId = null,
  onClose,
  onSuccess,
}) {
  const isEdit = mode === "edit" && Boolean(prendaId);

  const [form, setForm] = useState(crearEstadoInicial());
  const [previewImagenesNuevas, setPreviewImagenesNuevas] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [materialesCatalogo, setMaterialesCatalogo] = useState([]);

  const [loadingInicial, setLoadingInicial] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorCarga, setErrorCarga] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  const [clienteSearch, setClienteSearch] = useState("");
  const [clienteDropdownOpen, setClienteDropdownOpen] = useState(false);
  const clienteAutocompleteRef = useRef(null);

  const [tipoPrendaSearch, setTipoPrendaSearch] = useState("");
  const [tipoPrendaDropdownOpen, setTipoPrendaDropdownOpen] = useState(false);
  const tipoPrendaAutocompleteRef = useRef(null);

  const [medidasCliente, setMedidasCliente] = useState([]);
  const [loadingMedidasCliente, setLoadingMedidasCliente] = useState(false);
  const [errorMedidasCliente, setErrorMedidasCliente] = useState("");
  const [mostrarSelectorMedidas, setMostrarSelectorMedidas] = useState(!isEdit);
  const [editandoValoresMedidas, setEditandoValoresMedidas] = useState(false);
  const [modalMedidasAbierto, setModalMedidasAbierto] = useState(false);
  const [clienteParaMedidas, setClienteParaMedidas] = useState(null);

  const [mostrarSelectorMateriales, setMostrarSelectorMateriales] = useState(!isEdit);

  const [isDragOver, setIsDragOver] = useState(false);

  const tituloLimpio = useMemo(() => form.titulo.trim(), [form.titulo]);

  const totalImagenes = useMemo(
    () => form.imagenesExistentes.length + form.imagenesNuevas.length,
    [form.imagenesExistentes.length, form.imagenesNuevas.length]
  );

  const clientesFiltrados = useMemo(() => {
    const texto = clienteSearch.trim().toLowerCase();
    const lista = texto
      ? clientes.filter((item) => clienteCoincideBusqueda(item, texto))
      : clientes;

    return lista.slice(0, 12);
  }, [clientes, clienteSearch]);

  const clienteSeleccionado = useMemo(
    () => clientes.find((item) => String(item.cliente_id) === String(form.cliente_id)),
    [clientes, form.cliente_id]
  );

  const tiposPrendaFiltrados = useMemo(() => {
    const texto = tipoPrendaSearch.trim().toLowerCase();
    const lista = texto
      ? tiposPrenda.filter((item) => tipoPrendaCoincideBusqueda(item, texto))
      : tiposPrenda;

    return lista.slice(0, 12);
  }, [tiposPrenda, tipoPrendaSearch]);

  const tipoPrendaSeleccionado = useMemo(
    () =>
      tiposPrenda.find(
        (item) => String(item.tipo_prendas_id) === String(form.tipo_prenda_id)
      ),
    [tiposPrenda, form.tipo_prenda_id]
  );

  const medidasSeleccionadasIds = useMemo(() => {
    const ids = new Set();
    form.medidas.forEach((item) => {
      ids.add(obtenerKeyMedida(item));
      if (item.tipo_medida_id) ids.add(String(item.tipo_medida_id));
    });
    return ids;
  }, [form.medidas]);

  const materialesSeleccionadosIds = useMemo(() => {
    return new Set(form.materiales.map((item) => String(item.material_id)));
  }, [form.materiales]);

  const resetFormulario = () => {
    setForm(crearEstadoInicial());
    setPreviewImagenesNuevas([]);
    setErrorFormulario("");
    setErrorCarga("");
    setClienteSearch("");
    setClienteDropdownOpen(false);
    setTipoPrendaSearch("");
    setTipoPrendaDropdownOpen(false);
    setMedidasCliente([]);
    setLoadingMedidasCliente(false);
    setErrorMedidasCliente("");
    setMostrarSelectorMedidas(!isEdit);
    setEditandoValoresMedidas(false);
    setModalMedidasAbierto(false);
    setClienteParaMedidas(null);
    setMostrarSelectorMateriales(!isEdit);
  };

  useEffect(() => {
    if (!open) return;

    const previews = form.imagenesNuevas.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreviewImagenesNuevas(previews);

    return () => {
      previews.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [form.imagenesNuevas, open]);

  const abrirModalMedidasCliente = (cliente) => {
    if (!cliente) return;
    setClienteParaMedidas(cliente);
    setModalMedidasAbierto(true);
  };

  const cerrarModalMedidasCliente = () => {
    setModalMedidasAbierto(false);
    setClienteParaMedidas(null);
  };

  const cargarMedidasCliente = async (clienteId, opciones = {}) => {
    try {
      setLoadingMedidasCliente(true);
      setErrorMedidasCliente("");

      if (!clienteId) {
        setMedidasCliente([]);
        return [];
      }

      const response = await obtenerMedidasPorCliente(clienteId);
      const lista = normalizarRespuesta(response).map(normalizarMedidaCliente);
      setMedidasCliente(lista);

      if (opciones.abrirModalSiVacio && lista.length === 0 && opciones.cliente) {
        abrirModalMedidasCliente(opciones.cliente);
      }

      return lista;
    } catch (error) {
      console.error("Error al cargar medidas del cliente:", error);
      setMedidasCliente([]);
      setErrorMedidasCliente("No se pudieron cargar las medidas del cliente.");
      return [];
    } finally {
      setLoadingMedidasCliente(false);
    }
  };

  const handleMedidasClienteGuardadas = async () => {
    if (!form.cliente_id) return;
    await cargarMedidasCliente(form.cliente_id);
    setMostrarSelectorMedidas(true);
    setEditandoValoresMedidas(false);
  };

  const llenarFormulario = async (
    detalle,
    catalogoMaterialesNormalizado,
    clientesLista = [],
    tiposPrendaLista = []
  ) => {
    const clienteId = String(detalle.cliente_id ?? "");
    const tipoPrendaId = String(
      detalle.tipo_prenda_id ?? detalle.tipo_prendas_id ?? detalle.tipoPrendaId ?? ""
    );
    const medidasGuardadas = mapearMedidasExistentes(detalle);
    const materialesGuardados = mapearMaterialesExistentes(
      detalle,
      catalogoMaterialesNormalizado
    );

    setForm({
      cliente_id: clienteId,
      tipo_prenda_id: tipoPrendaId,
      titulo: String(detalle.titulo ?? ""),
      imagenesExistentes: mapearImagenesExistentes(detalle),
      imagenesNuevas: [],
      medidas: medidasGuardadas,
      materiales: materialesGuardados,
    });

    if (clienteId) {
      const cliente = clientesLista.find(
        (item) => String(item.cliente_id) === clienteId
      );
      setClienteSearch(formatearClienteDisplay(cliente));
      await cargarMedidasCliente(clienteId);
    } else {
      setClienteSearch("");
      setMedidasCliente([]);
    }

    setClienteDropdownOpen(false);

    if (tipoPrendaId) {
      const tipo = tiposPrendaLista.find(
        (item) => String(item.tipo_prendas_id) === tipoPrendaId
      );
      setTipoPrendaSearch(formatearTipoPrendaDisplay(tipo));
    } else {
      setTipoPrendaSearch("");
    }

    setTipoPrendaDropdownOpen(false);
    setMostrarSelectorMedidas(medidasGuardadas.length === 0);
    setEditandoValoresMedidas(false);
    setMostrarSelectorMateriales(materialesGuardados.length === 0);
  };

  const cargarDatos = async () => {
    try {
      setLoadingInicial(true);
      setErrorCarga("");

      const promises = [
        obtenerClientesActivosService(),
        obtenerTiposPrendaActivosService(),
        obtenerMaterialesActivosService(),
      ];

      if (isEdit && prendaId) {
        promises.push(obtenerPrendaPorId(prendaId));
      }

      const responses = await Promise.all(promises);

      const [clientesResp, tiposPrendaResp, materialesResp, detalleResp] = responses;

      const catalogoMaterialesNormalizado = normalizarRespuesta(materialesResp).map(
        normalizarMaterialCatalogo
      );

      const clientesLista = normalizarRespuesta(clientesResp).map(normalizarCliente);
      setClientes(clientesLista);
      const tiposPrendaLista = normalizarRespuesta(tiposPrendaResp).map(normalizarTipoPrenda);
      setTiposPrenda(tiposPrendaLista);
      setMaterialesCatalogo(catalogoMaterialesNormalizado);

      if (isEdit && detalleResp) {
        const detalle = obtenerDetallePrenda(detalleResp);
        await llenarFormulario(
          detalle,
          catalogoMaterialesNormalizado,
          clientesLista,
          tiposPrendaLista
        );
      } else {
        resetFormulario();
      }
    } catch (error) {
      console.error("Error al cargar datos del formulario:", error);
      setErrorCarga(
        isEdit
          ? "No se pudo cargar la información de la prenda."
          : "No se pudo cargar la información del formulario."
      );
    } finally {
      setLoadingInicial(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, prendaId, open]);

  useEffect(() => {
    if (!clienteDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (
        clienteAutocompleteRef.current &&
        !clienteAutocompleteRef.current.contains(event.target)
      ) {
        setClienteDropdownOpen(false);
        if (clienteSeleccionado) {
          setClienteSearch(formatearClienteDisplay(clienteSeleccionado));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clienteDropdownOpen, clienteSeleccionado]);

  useEffect(() => {
    if (!tipoPrendaDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (
        tipoPrendaAutocompleteRef.current &&
        !tipoPrendaAutocompleteRef.current.contains(event.target)
      ) {
        setTipoPrendaDropdownOpen(false);
        if (tipoPrendaSeleccionado) {
          setTipoPrendaSearch(formatearTipoPrendaDisplay(tipoPrendaSeleccionado));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tipoPrendaDropdownOpen, tipoPrendaSeleccionado]);

  if (!open) return null;

  const seleccionarCliente = async (cliente) => {
    const clienteId = String(cliente.cliente_id);

    setForm((prev) => ({
      ...prev,
      cliente_id: clienteId,
      medidas: [],
    }));
    setClienteSearch(formatearClienteDisplay(cliente));
    setClienteDropdownOpen(false);
    setErrorFormulario("");
    setMostrarSelectorMedidas(true);
    setEditandoValoresMedidas(false);
    await cargarMedidasCliente(clienteId, {
      abrirModalSiVacio: true,
      cliente,
    });
  };

  const limpiarClienteSeleccion = () => {
    setForm((prev) => ({
      ...prev,
      cliente_id: "",
      medidas: [],
    }));
    setClienteSearch("");
    setClienteDropdownOpen(true);
    setMedidasCliente([]);
    setErrorMedidasCliente("");
    setMostrarSelectorMedidas(true);
    setEditandoValoresMedidas(false);
    cerrarModalMedidasCliente();
    setErrorFormulario("");
  };

  const handleClienteInputChange = (e) => {
    const value = e.target.value;
    setClienteSearch(value);
    setClienteDropdownOpen(true);

    if (!form.cliente_id) return;

    const seleccionado = clientes.find(
      (item) => String(item.cliente_id) === String(form.cliente_id)
    );
    const etiquetaSeleccionada = formatearClienteDisplay(seleccionado);

    if (value.trim() !== etiquetaSeleccionada) {
      setForm((prev) => ({
        ...prev,
        cliente_id: "",
        medidas: [],
      }));
      setMedidasCliente([]);
      setErrorMedidasCliente("");
      setMostrarSelectorMedidas(true);
      setEditandoValoresMedidas(false);
      cerrarModalMedidasCliente();
    }
  };

  const seleccionarTipoPrenda = (tipo) => {
    const tipoPrendaId = String(tipo.tipo_prendas_id);

    setForm((prev) => ({
      ...prev,
      tipo_prenda_id: tipoPrendaId,
    }));
    setTipoPrendaSearch(formatearTipoPrendaDisplay(tipo));
    setTipoPrendaDropdownOpen(false);
    setErrorFormulario("");
  };

  const limpiarTipoPrendaSeleccion = () => {
    setForm((prev) => ({
      ...prev,
      tipo_prenda_id: "",
    }));
    setTipoPrendaSearch("");
    setTipoPrendaDropdownOpen(true);
    setErrorFormulario("");
  };

  const handleTipoPrendaInputChange = (e) => {
    const value = e.target.value;
    setTipoPrendaSearch(value);
    setTipoPrendaDropdownOpen(true);

    if (!form.tipo_prenda_id) return;

    const seleccionado = tiposPrenda.find(
      (item) => String(item.tipo_prendas_id) === String(form.tipo_prenda_id)
    );
    const etiquetaSeleccionada = formatearTipoPrendaDisplay(seleccionado);

    if (value.trim() !== etiquetaSeleccionada) {
      setForm((prev) => ({
        ...prev,
        tipo_prenda_id: "",
      }));
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorFormulario("");
  };

  const toggleMedidaCliente = (medida) => {
    const key = obtenerKeyMedida(medida);

    setForm((prev) => {
      const existe = prev.medidas.some((item) => obtenerKeyMedida(item) === key);

      if (existe) {
        return {
          ...prev,
          medidas: prev.medidas.filter((item) => obtenerKeyMedida(item) !== key),
        };
      }

      return {
        ...prev,
        medidas: [...prev.medidas, normalizarMedidaCliente(medida)],
      };
    });
  };

  const actualizarValorMedidaPrenda = (key, valor) => {
    setForm((prev) => ({
      ...prev,
      medidas: prev.medidas.map((item) =>
        obtenerKeyMedida(item) === String(key) ? { ...item, valor: String(valor) } : item
      ),
    }));
    setErrorFormulario("");
  };

  const quitarMedidaPrenda = (key) => {
    setForm((prev) => ({
      ...prev,
      medidas: prev.medidas.filter((item) => obtenerKeyMedida(item) !== String(key)),
    }));
  };

  const activarEdicionValoresMedidas = () => {
    setEditandoValoresMedidas(true);
    setMostrarSelectorMedidas(false);
  };

  const desactivarEdicionValoresMedidas = () => {
    setEditandoValoresMedidas(false);
  };

  const toggleMaterial = (material) => {
    const materialId = String(material.material_id);

    setForm((prev) => {
      const existe = prev.materiales.some(
        (item) => String(item.material_id) === materialId
      );

      if (existe) {
        return {
          ...prev,
          materiales: prev.materiales.filter(
            (item) => String(item.material_id) !== materialId
          ),
        };
      }

      return {
        ...prev,
        materiales: [
          ...prev.materiales,
          {
            material_id: materialId,
            nombre_material: material.nombre_material,
            unidad_label: material.unidad_label,
            cantidad: 1,
            observacion: "",
          },
        ],
      };
    });
  };

  const cambiarCantidadMaterial = (materialId, cambio) => {
    setForm((prev) => ({
      ...prev,
      materiales: prev.materiales.map((item) => {
        if (String(item.material_id) !== String(materialId)) return item;

        const nuevaCantidad = Number(item.cantidad || 0) + cambio;

        return {
          ...item,
          cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad,
        };
      }),
    }));
  };

  const cambiarObservacionMaterial = (materialId, valor) => {
    setForm((prev) => ({
      ...prev,
      materiales: prev.materiales.map((item) =>
        String(item.material_id) === String(materialId)
          ? { ...item, observacion: valor }
          : item
      ),
    }));
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const archivos = Array.from(e.dataTransfer.files || []);
    const espaciosDisponibles = MAX_IMAGENES - totalImagenes;

    if (espaciosDisponibles <= 0) return;

    const archivosImagenes = archivos.filter(file => file.type.startsWith('image/'));
    const archivosPermitidos = archivosImagenes.slice(0, espaciosDisponibles);

    if (archivosPermitidos.length > 0) {
      setForm((prev) => ({
        ...prev,
        imagenesNuevas: [...prev.imagenesNuevas, ...archivosPermitidos],
      }));
    }
  };

  const eliminarImagenExistente = (index) => {
    setForm((prev) => ({
      ...prev,
      imagenesExistentes: prev.imagenesExistentes.filter((_, i) => i !== index),
    }));
  };

  const eliminarImagenNueva = (index) => {
    setForm((prev) => ({
      ...prev,
      imagenesNuevas: prev.imagenesNuevas.filter((_, i) => i !== index),
    }));
  };

  const validarFormulario = () => {
    if (!tituloLimpio) return "Debes ingresar un título.";
    if (!form.cliente_id) return "Debes seleccionar un cliente.";
    if (!form.tipo_prenda_id) return "Debes seleccionar un tipo de prenda.";
    if (!form.medidas.length) return "Debes seleccionar al menos una medida del cliente.";

    for (const medida of form.medidas) {
      const valor = Number(medida.valor);
      if (medida.valor === "" || Number.isNaN(valor)) {
        return `La medida "${medida.nombre_tipo_medida}" debe tener un valor numérico válido.`;
      }
    }

    for (const material of form.materiales) {
      if (!material.material_id || Number(material.cantidad) <= 0) {
        return "Cada material debe tener una cantidad válida.";
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
    imagenes: [
      ...form.imagenesExistentes.map((img) => img.valor),
      ...imagenesSubidas,
    ].slice(0, MAX_IMAGENES),
    medidas: form.medidas.map((item) => ({
      tipo_medida_id: Number(item.tipo_medida_id),
      unidad_id: Number(item.unidad_id),
      valor: Number(item.valor),
    })),
    materiales: form.materiales.map((item) => ({
      material_id: Number(item.material_id),
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

      const response = isEdit
        ? await updatePrendas(prendaId, payload)
        : await crearPrendas(payload);

      if (onSuccess) {
        await onSuccess(response);
      }
    } catch (error) {
      console.error("Error al guardar la prenda:", error);
      setErrorFormulario(
        error?.response?.data?.message ||
          error?.message ||
          (isEdit
            ? "No se pudo actualizar la prenda."
            : "No se pudo guardar la prenda.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("crear-prenda-modal") && onClose) {
      onClose();
    }
  };

  return (
    <div className="crear-prenda-modal" onClick={handleOverlayClick}>
      <div className="crear-prenda-modal__content">
        <div className="crear-prenda-modal__header">
          <div className="crear-prenda-modal__header-left">
            <span className="crear-prenda-modal__eyebrow">
              {isEdit ? "Editar" : "Nueva"}
            </span>
            <h2 className="crear-prenda-modal__title">
              {isEdit ? "Actualizar prenda" : "Crear prenda"}
            </h2>
          </div>

          <button
            type="button"
            className="crear-prenda-modal__close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        {loadingInicial && (
          <div className="crear-prenda-form__empty">
            {isEdit
              ? "Cargando información de la prenda..."
              : "Cargando información del formulario..."}
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

            <div className="crear-prenda-layout">
              <aside className="crear-prenda-sidebar">
                <div className="crear-prenda-sidebar__header">
                  <div>
                    <h3>Imágenes</h3>
                  </div>
                  <span className="crear-prenda-sidebar__counter">
                    {totalImagenes}/{MAX_IMAGENES}
                  </span>
                </div>

                <div className="crear-prenda-sidebar__actions">
                  <label
                    className={`crear-prenda-sidebar__action ${
                      totalImagenes >= MAX_IMAGENES ? "is-disabled" : ""
                    }`}
                  >
                    Subir
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagenesChange}
                      hidden
                      disabled={saving || totalImagenes >= MAX_IMAGENES}
                    />
                  </label>
                </div>

                <div className={`crear-prenda-sidebar__gallery ${isDragOver ? 'is-drag-over' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                  {form.imagenesExistentes.map((imagen, index) => (
                    <div
                      key={`existente-${imagen.nombre}-${index}`}
                      className="crear-prenda-gallery-card"
                    >
                      <div className="crear-prenda-gallery-card__frame">
                        <img src={imagen.vista} alt={imagen.nombre} />
                      </div>

                      <div className="crear-prenda-gallery-card__body">
                        <span title={imagen.nombre}>{imagen.nombre}</span>

                        <div className="crear-prenda-gallery-card__actions">
                          <button
                            type="button"
                            onClick={() => eliminarImagenExistente(index)}
                            disabled={saving}
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {previewImagenesNuevas.map((imagen, index) => (
                    <div
                      key={`nueva-${imagen.nombre}-${index}`}
                      className="crear-prenda-gallery-card"
                    >
                      <div className="crear-prenda-gallery-card__frame">
                        <img src={imagen.url} alt={imagen.nombre} />
                      </div>

                      <div className="crear-prenda-gallery-card__body">
                        <span title={imagen.nombre}>{imagen.nombre}</span>

                        <div className="crear-prenda-gallery-card__actions">
                          <button
                            type="button"
                            onClick={() => eliminarImagenNueva(index)}
                            disabled={saving}
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {form.imagenesExistentes.length === 0 &&
                    previewImagenesNuevas.length === 0 && (
                      <div className="crear-prenda-form__empty crear-prenda-form__empty--soft">
                        Sin imágenes
                      </div>
                    )}
                </div>
              </aside>

              <section className="crear-prenda-main">
                <div className="crear-prenda-card">
                  <div className="crear-prenda-form__grid crear-prenda-form__grid--top">
                    <div className="crear-prenda-form__group crear-prenda-form__group--full">
                      <label>Título <span className="tm-required">*</span></label>
                      <div className="crear-prenda-input-icon">
                        <Tag size={18} />
                        <input
                          type="text"
                          name="titulo"
                          value={form.titulo}
                          onChange={handleChange}
                          placeholder="Nombre de la prenda"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div
                      className="crear-prenda-form__group crear-prenda-form__group--full crear-prenda-autocomplete"
                      ref={clienteAutocompleteRef}
                    >
                      <label>Cliente <span className="tm-required">*</span></label>
                      <div className="crear-prenda-input-icon crear-prenda-autocomplete__trigger">
                        {form.cliente_id ? <User size={18} /> : <Search size={18} />}
                        <input
                          type="text"
                          value={clienteSearch}
                          onChange={handleClienteInputChange}
                          onFocus={() => setClienteDropdownOpen(true)}
                          placeholder="Buscar por nombre o teléfono"
                          disabled={saving}
                          autoComplete="off"
                          aria-expanded={clienteDropdownOpen}
                          aria-autocomplete="list"
                        />
                        {form.cliente_id && (
                          <button
                            type="button"
                            className="crear-prenda-autocomplete__clear"
                            onClick={limpiarClienteSeleccion}
                            disabled={saving}
                            aria-label="Quitar cliente seleccionado"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      {clienteDropdownOpen && !saving && (
                        <ul className="crear-prenda-autocomplete__list" role="listbox">
                          {clientesFiltrados.length > 0 ? (
                            clientesFiltrados.map((cliente) => {
                              const seleccionado =
                                String(cliente.cliente_id) === String(form.cliente_id);
                              return (
                                <li key={cliente.cliente_id} role="option" aria-selected={seleccionado}>
                                  <button
                                    type="button"
                                    className={`crear-prenda-autocomplete__option${
                                      seleccionado ? " is-selected" : ""
                                    }`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => seleccionarCliente(cliente)}
                                  >
                                    <span className="crear-prenda-autocomplete__option-name">
                                      {formatearClienteDisplay(cliente)}
                                    </span>
                                  </button>
                                </li>
                              );
                            })
                          ) : (
                            <li className="crear-prenda-autocomplete__empty" role="presentation">
                              {clienteSearch.trim()
                                ? "No se encontraron clientes"
                                : "No hay clientes disponibles"}
                            </li>
                          )}
                        </ul>
                      )}
                      <input
                        type="hidden"
                        name="cliente_id"
                        value={form.cliente_id}
                        required
                      />
                    </div>

                    <div
                      className="crear-prenda-form__group crear-prenda-form__group--full crear-prenda-autocomplete"
                      ref={tipoPrendaAutocompleteRef}
                    >
                      <label>Tipo de prenda <span className="tm-required">*</span></label>
                      <div className="crear-prenda-input-icon crear-prenda-autocomplete__trigger">
                        {form.tipo_prenda_id ? <Scissors size={18} /> : <Search size={18} />}
                        <input
                          type="text"
                          value={tipoPrendaSearch}
                          onChange={handleTipoPrendaInputChange}
                          onFocus={() => setTipoPrendaDropdownOpen(true)}
                          placeholder="Buscar tipo de prenda"
                          disabled={saving}
                          autoComplete="off"
                          aria-expanded={tipoPrendaDropdownOpen}
                          aria-autocomplete="list"
                        />
                        {form.tipo_prenda_id && (
                          <button
                            type="button"
                            className="crear-prenda-autocomplete__clear"
                            onClick={limpiarTipoPrendaSeleccion}
                            disabled={saving}
                            aria-label="Quitar tipo de prenda seleccionado"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      {tipoPrendaDropdownOpen && !saving && (
                        <ul className="crear-prenda-autocomplete__list" role="listbox">
                          {tiposPrendaFiltrados.length > 0 ? (
                            tiposPrendaFiltrados.map((tipo) => {
                              const seleccionado =
                                String(tipo.tipo_prendas_id) === String(form.tipo_prenda_id);
                              return (
                                <li
                                  key={tipo.tipo_prendas_id}
                                  role="option"
                                  aria-selected={seleccionado}
                                >
                                  <button
                                    type="button"
                                    className={`crear-prenda-autocomplete__option${
                                      seleccionado ? " is-selected" : ""
                                    }`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => seleccionarTipoPrenda(tipo)}
                                  >
                                    <span className="crear-prenda-autocomplete__option-name">
                                      {formatearTipoPrendaDisplay(tipo)}
                                    </span>
                                  </button>
                                </li>
                              );
                            })
                          ) : (
                            <li className="crear-prenda-autocomplete__empty" role="presentation">
                              {tipoPrendaSearch.trim()
                                ? "No se encontraron tipos de prenda"
                                : "No hay tipos de prenda disponibles"}
                            </li>
                          )}
                        </ul>
                      )}
                      <input
                        type="hidden"
                        name="tipo_prenda_id"
                        value={form.tipo_prenda_id}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="crear-prenda-card">
                  <div className="crear-prenda-medidas-header">
                    <div className="crear-prenda-medidas-title">
                      <Ruler size={20} className="crear-prenda-medidas-title__icon" />
                      <div>
                        <h3>Medidas</h3>
                      </div>
                    </div>

                    {!!clienteSeleccionado && (
                      <div className="crear-prenda-medidas-actions">
                        {form.medidas.length > 0 && (
                          <button
                            type="button"
                            className={`crear-prenda-form__mini-button ${
                              editandoValoresMedidas ? "is-active" : ""
                            }`}
                            onClick={
                              editandoValoresMedidas
                                ? desactivarEdicionValoresMedidas
                                : activarEdicionValoresMedidas
                            }
                            disabled={saving || loadingMedidasCliente}
                          >
                            <Edit3 size={14} />
                            {editandoValoresMedidas ? "Listo" : "Modificar valores"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="crear-prenda-form__mini-button"
                          onClick={() => {
                            setMostrarSelectorMedidas((prev) => !prev);
                            if (!mostrarSelectorMedidas) {
                              setEditandoValoresMedidas(false);
                            }
                          }}
                          disabled={saving || loadingMedidasCliente}
                        >
                          {mostrarSelectorMedidas ? "Ocultar" : "Agregar más"}
                        </button>
                      </div>
                    )}
                  </div>

                  {!clienteSeleccionado && (
                    <div className="crear-prenda-form__empty">
                      Selecciona cliente
                    </div>
                  )}

                  {clienteSeleccionado && loadingMedidasCliente && (
                    <div className="crear-prenda-form__empty">Cargando medidas...</div>
                  )}

                  {clienteSeleccionado && !loadingMedidasCliente && errorMedidasCliente && (
                    <div className="crear-prenda-form__empty">{errorMedidasCliente}</div>
                  )}

                  {clienteSeleccionado &&
                    !loadingMedidasCliente &&
                    !errorMedidasCliente && (
                      <>
                        {editandoValoresMedidas && form.medidas.length > 0 && (
                          <p className="crear-prenda-medidas-hint">
                            Ajusta los valores de esta prenda. Los cambios se guardan al
                            actualizar el formulario.
                          </p>
                        )}

                        {editandoValoresMedidas ? (
                          <div className="crear-prenda-medidas-edit-grid">
                            {form.medidas.map((item) => {
                              const key = obtenerKeyMedida(item);
                              const unidad =
                                item.simbolo_unidad || item.nombre_unidad || "";

                              return (
                                <div key={key} className="crear-prenda-medida-edit-item">
                                  <label htmlFor={`medida-valor-${key}`}>
                                    {item.nombre_tipo_medida}
                                  </label>
                                  <div className="crear-prenda-medida-edit-item__row">
                                    <input
                                      id={`medida-valor-${key}`}
                                      type="number"
                                      inputMode="decimal"
                                      step="any"
                                      min="0"
                                      value={item.valor}
                                      onChange={(e) =>
                                        actualizarValorMedidaPrenda(key, e.target.value)
                                      }
                                      disabled={saving}
                                    />
                                    {unidad && (
                                      <span className="crear-prenda-medida-edit-item__unit">
                                        {unidad}
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      className="crear-prenda-medida-edit-item__remove"
                                      onClick={() => quitarMedidaPrenda(key)}
                                      disabled={saving}
                                      aria-label={`Quitar ${item.nombre_tipo_medida}`}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="crear-prenda-medidas-seleccionadas">
                            {form.medidas.length > 0 ? (
                              form.medidas.map((item) => {
                                const key = obtenerKeyMedida(item);

                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    className={`crear-prenda-medida-chip is-selected ${
                                      mostrarSelectorMedidas ? "" : "is-locked"
                                    }`}
                                    onClick={
                                      mostrarSelectorMedidas
                                        ? () => toggleMedidaCliente(item)
                                        : undefined
                                    }
                                    disabled={saving || !mostrarSelectorMedidas}
                                  >
                                    <span className="crear-prenda-medida-chip__name">
                                      {item.nombre_tipo_medida}
                                    </span>
                                    <span className="crear-prenda-medida-chip__value">
                                      {item.valor}{" "}
                                      {item.simbolo_unidad || item.nombre_unidad || ""}
                                    </span>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="crear-prenda-form__empty crear-prenda-form__empty--soft">
                                Elige medidas
                              </div>
                            )}
                          </div>
                        )}

                        {mostrarSelectorMedidas && !editandoValoresMedidas && (
                          <>
                          {medidasCliente.length === 0 ? (
                            <div className="crear-prenda-form__empty crear-prenda-medidas-sin-registro">
                              <p>
                                Este cliente no tiene medidas registradas. Regístralas
                                para poder asociarlas a la prenda.
                              </p>
                              <button
                                type="button"
                                className="crear-prenda-form__mini-button"
                                onClick={() =>
                                  abrirModalMedidasCliente(clienteSeleccionado)
                                }
                                disabled={saving}
                              >
                                <Ruler size={14} />
                                Registrar medidas del cliente
                              </button>
                            </div>
                          ) : (
                          <div className="crear-prenda-medidas-grid">
                            {medidasCliente.map((item) => {
                              const key = obtenerKeyMedida(item);
                              const activo =
                                medidasSeleccionadasIds.has(key) ||
                                medidasSeleccionadasIds.has(String(item.tipo_medida_id));

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  className={`crear-prenda-medida-card ${
                                    activo ? "is-active" : ""
                                  }`}
                                  onClick={() => toggleMedidaCliente(item)}
                                  disabled={saving}
                                >
                                  <span className="crear-prenda-medida-card__check">
                                    {activo ? <Check size={16} /> : <Plus size={16} />}
                                  </span>

                                  <div className="crear-prenda-medida-card__body">
                                    <strong>{item.nombre_tipo_medida}</strong>
                                    <span>
                                      {item.valor}{" "}
                                      {item.simbolo_unidad || item.nombre_unidad || ""}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          )}
                          </>
                        )}
                      </>
                    )}
                </div>

                <div className="crear-prenda-card">
                  <div className="crear-prenda-medidas-header">
                    <div className="crear-prenda-medidas-title">
                      <PencilRuler size={20} className="crear-prenda-medidas-title__icon" />
                      <div>
                        <h3>Materiales</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="crear-prenda-form__mini-button"
                      onClick={() => setMostrarSelectorMateriales((prev) => !prev)}
                      disabled={saving}
                    >
                      {mostrarSelectorMateriales ? "Ocultar" : "Agregar más"}
                    </button>
                  </div>

                  <div className="crear-prenda-medidas-seleccionadas">
                    {form.materiales.length > 0 ? (
                      form.materiales.map((material) => (
                        <div
                          key={material.material_id}
                          className="crear-prenda-material-chip is-selected"
                        >
                          <button
                            type="button"
                            className="crear-prenda-material-chip__remove"
                            onClick={() => toggleMaterial(material)}
                            disabled={saving}
                          >
                            <X size={16} />
                          </button>

                          <span className="crear-prenda-material-chip__name">
                            {material.nombre_material}
                          </span>

                          <span className="crear-prenda-material-chip__unit">
                            {material.unidad_label || "unidad"}
                          </span>

                          <div className="crear-prenda-material-stepper">
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidadMaterial(material.material_id, -1)
                              }
                              disabled={saving}
                            >
                              <Minus size={16} />
                            </button>

                            <span>{material.cantidad}</span>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidadMaterial(material.material_id, 1)
                              }
                              disabled={saving}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="crear-prenda-input-icon crear-prenda-input-icon--mini">
                            <Edit3 size={16} />
                            <input
                              type="text"
                              value={material.observacion}
                              onChange={(e) =>
                                cambiarObservacionMaterial(
                                  material.material_id,
                                  e.target.value
                                )
                              }
                              placeholder="Detalle"
                              disabled={saving}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="crear-prenda-form__empty crear-prenda-form__empty--soft">
                        Elige materiales
                      </div>
                    )}
                  </div>

                  {mostrarSelectorMateriales && (
                    <div className="crear-prenda-medidas-grid">
                      {materialesCatalogo.map((material) => {
                        const activo = materialesSeleccionadosIds.has(
                          String(material.material_id)
                        );

                        return (
                          <button
                            key={material.material_id}
                            type="button"
                            className={`crear-prenda-medida-card ${
                              activo ? "is-active" : ""
                            }`}
                            onClick={() => toggleMaterial(material)}
                            disabled={saving}
                          >
                            <span className="crear-prenda-medida-card__check">
                              {activo ? <Check size={16} /> : <Plus size={16} />}
                            </span>

                            <div className="crear-prenda-medida-card__body">
                              <strong>{material.nombre_material}</strong>
                              <span>{material.unidad_label || "unidad"}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>

            <p className="tm-required-note">
              <span className="tm-required">*</span> Campos obligatorios
            </p>

            <div className="crear-prenda-form__footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={onClose}
                disabled={saving}
              >
                <XCircle size={16} />
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-guardar"
                disabled={saving}
              >
                <Save size={16} />
                {saving
                  ? isEdit
                    ? "Guardando cambios..."
                    : "Guardando..."
                  : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>

      {modalMedidasAbierto && clienteParaMedidas && (
        <ModalMedidas
          cliente={clienteParaMedidas}
          sinMedidasRegistradas
          onClose={cerrarModalMedidasCliente}
          onGuardado={handleMedidasClienteGuardadas}
        />
      )}
    </div>
  );
}

export default PrendaFormulario;