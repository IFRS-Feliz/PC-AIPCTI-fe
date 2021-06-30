import axios from "axios";

//criar instacia do axios com presets
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
  withCredentials: true,
});

//instancia para realizar login
export const loginAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
  responseType: "json",
  withCredentials: true,
}); //instancia sem interceptors para Login

//instacia para requisitar arquivos
export const fileBufferAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
  responseType: "arraybuffer",
  withCredentials: true,
});

//enviar token nos headers do request caso ele exista
//caso ele nao exista, servidor respondera se deu refresh ou nao
function AddbearerTokenInterceptor(config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
}

instance.interceptors.request.use(AddbearerTokenInterceptor);
fileBufferAxios.interceptors.request.use(AddbearerTokenInterceptor);

//setar novo token
//em casos de erro redirecionar para o lugar certo
instance.interceptors.response.use(
  (response) => {
    const token = response.data.token;
    if (token) localStorage.setItem("token", token);
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      //token e refreshtoken invalidos
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response.status === 403) {
      //usuario tentnado acessar conteudo que nao lhe pertence
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response.status === 500) {
      //erros nos querys do banco e outros erros internos inesperados
      alert("Erro no servidor (500). Tente novamente.");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
