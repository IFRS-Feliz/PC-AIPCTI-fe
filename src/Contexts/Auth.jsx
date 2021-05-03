import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router";
import { loginAxios } from "../axios";

const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem("token") || null);
  const history = useHistory();

  function Login(token) {
    localStorage.setItem("token", token);

    const decodedToken = jwt_decode(token);
    setUser({
      nome: decodedToken.name,
      email: decodedToken.email,
      cpf: decodedToken.cpf,
    });

    if (decodedToken.isAdmin === 1) {
      history.push("/admin");
    } else {
      history.push("/projetos");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser({
        nome: decodedToken.name,
        email: decodedToken.email,
        cpf: decodedToken.cpf,
      });
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
  const isAdmin = jwt_decode(token).isAdmin;

  return isAdmin;
}

export default AuthContext;
