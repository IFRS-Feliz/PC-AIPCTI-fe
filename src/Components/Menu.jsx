import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import style from "../assets/css/components/menu.module.css";
import AuthContext, { isAdmin } from "../Contexts/Auth";

export default function Menu() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return <div className={style.containerMenu}></div>;

  return (
    <div className={style.containerMenu}>
      <div>
        <div className={style.containerInner}>
          <div>
            {
              //definitivamente temos que pensar em um jeito mais inteligente
              //pra isso daqui no futuro

              //substring para caso tenha um trailing slash
              //split com filter para saber quantos niveis acima do root o path está
              location.pathname
                .substring(0, location.pathname.length - 1)
                .split("/")
                .filter((i) => i !== "").length !== 1 && (
                <Link
                  className={style.linkMenu}
                  to={location.pathname.substring(
                    0,
                    location.pathname.lastIndexOf("/")
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                </Link>
              )
            }
          </div>
          <div>
            {isAdmin() ? (
              <Link to="/admin" className={style.linkMenu}>
                Home
              </Link>
            ) : (
              <Link to="/projetos" className={style.linkMenu}>
                Home
              </Link>
            )}
          </div>
          {isAdmin() ? (
            <>
              <div>
                <Link to="/admin/usuarios" className={style.linkMenu}>
                  Usuários
                </Link>
              </div>
              <div>
                <Link to="/admin/editais" className={style.linkMenu}>
                  Editais
                </Link>
              </div>
              <div>
                <Link to="/admin/projetos" className={style.linkMenu}>
                  Projetos
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className={style.containerInner}>
          <div className={style.account}>
            <p>Seja bem vindo(a), {user.nome && user.nome.split(" ")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
