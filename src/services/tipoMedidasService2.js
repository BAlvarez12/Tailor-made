import axios from "axios";

const API = "http://localhost:3000/api/tipo_medidas2";

export const getTiposMedida = async () => {
  const res = await axios.get(API);
  return res.data;
};