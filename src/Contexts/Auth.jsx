import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router";
import { loginAxios } from "../axios";

const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
  //caso haja uma token no localStorage, o user é setado com o seu valor
  //isso acontece porque os componentes que verificam se o user esta logado
  //verificam se o estado user é truthy
  //ao setar ele para null, eles redirecionariam o user. dessa maneira é possivel que o
  //useEffect desse componente rode antes e decida se o token é valido ou nao
  const [user, setUser] = useState(localStorage.getItem("token") || null);
  const history = useHistory();

  function Login(token) {
    try {
      //pegar payload do token com informacoes do usuario
      const decodedToken = jwt_decode(token);

      localStorage.setItem("token", token);

      //setar usuario para outros componentes terem informacoes sobre ele
      setUser({
        nome: decodedToken.name,
        email: decodedToken.email,
        cpf: decodedToken.cpf,
      });

      //redirecionar dependendo do role do usuario
      if (decodedToken.isAdmin === 1) {
        history.push("/admin");
      } else {
        history.push("/projetos");
      }
    } catch (error) {
      //caso o token seja invalido
      setUser(null);
    }
  }

  function Logout() {
    //remover cookie do refreshToken
    loginAxios.get("/auth/logout").catch((e) => {
      console.log(e);
    });
    localStorage.removeItem("token");
    setUser(null);
  }

  //logar o usuario ao carregar a pagina pela primeira vez ou ao recarregar
  useEffect(() => {
    const token = localStorage.getItem("token");

    //casi haja um token no localStorage
    if (token) {
      try {
        const decodedToken = jwt_decode(token);

        setUser({
          nome: decodedToken.name,
          email: decodedToken.email,
          cpf: decodedToken.cpf,
        });
      } catch (error) {
        //caso o token seja invalido, remover e deslogar o usuario
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        Login: Login,
        Logout: Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ** Mudar no futuro **
//isAdmin nao faz parte do contexto por nao ser possivel adiciona-lo antes de um useEffect
//fazendo com que o WithAuth perceba-o como null sempre
export function isAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const isAdmin = jwt_decode(token).isAdmin;
    return isAdmin;
  } catch (error) {
    return false;
  }
}

export default AuthContext;
