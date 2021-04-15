import axios from "axios";

//criar instacia do axios com presets
const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  responseType: "json",
});

export const loginAxios = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
  responseType: "json",
}); //instancia sem interceptors para Login
loginAxios.defaults.withCredentials = true;

//enviar token nos headers do request caso ele exista
//caso ele nao exista, servidor respondera se deu refresh ou nao
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

//setar novo token
//em casos de erro redirecionar para o lugar certo
instance.interceptors.response.use(
  (response) => {
    localStorage.setItem("token", response.data.token);
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
      //nao admin tentando acessar paginas do admin
      window.location.href = "/projetos";
      return Promise.reject(error);
    }
  }
);

instance.defaults.withCredentials = true;

export default instance;
