import axios from "axios";

axios.defaults.withCredentials = true;

//interceptor comentado por nao conseguir usar hooks (como useHistory) fora de um componente
//ver como fazer isso dps

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (e) => {
//     if (e.response.status === 401 || e.response.status === 403) {
//       window.location.href = "/login";
//     }
//   }
// );

export default axios;
