import {
  createTipo,
  updateTipo,
  archiveTipo,
  restoreTipo
} from "../../services/tipoMedidasService";

export const guardarTipo = async ({
  modoCrear,
  tipoSeleccionado,
  formData,
  setShowModal,
  cargarTipos
}) => {
  if (modoCrear) {
    await createTipo(formData);
  } else {
    await updateTipo(tipoSeleccionado.tipo_medida_id, formData);
  }

  setShowModal(false);
  cargarTipos();
};

export const archivarIndividual = async (tipo, setShowModal, cargarTipos) => {
  await archiveTipo(tipo.tipo_medida_id);
  setShowModal(false);
  cargarTipos();
};

export const restaurarIndividual = async (tipo, setShowModal, cargarTipos) => {
  await restoreTipo(tipo.tipo_medida_id);
  setShowModal(false);
  cargarTipos();
};