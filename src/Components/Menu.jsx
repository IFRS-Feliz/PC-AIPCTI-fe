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
                  to={location.pathname.substring(
                    0,
                    location.pathname.lastIndexOf("/")
                  )}
                >
                  Arrow
                </Link>
              )
            }
          </div>
          <div>
            {isAdmin() ? (
              <Link to="/admin">Home</Link>
            ) : (
              <Link to="/projetos">Home</Link>
            )}
          </div>
          {isAdmin() ? (
            <>
              <div>
                <Link to="/admin/usuarios">Usuários</Link>
              </div>
              <div>
                <Link to="/admin/editais">Editais</Link>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className={style.containerInner}>
          <div>Account</div>
        </div>
      </div>
    </div>
  );
}
