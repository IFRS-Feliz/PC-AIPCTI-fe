import { useContext, useState } from "react";
import AuthContext from "../Contexts/Auth";
import axios from "../axios";

import style from "../assets/css/routes/login.module.css";
import { useHistory } from "react-router-dom";
import Loading from "../Components/Loading";

export default function AlterarSenha() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState();

  function handleSubmit() {
    setIsLoading(true);
    axios
      .put(`/usuario/${user.cpf}/senha`, { password: newPassword })
      .then(() => {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => history.push("/"), 1000);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setSuccess(false);
      });
  }

  const [newPassword, setNewPassword] = useState("");
  return (
    <div className={style.containerLogin} style={{ position: "relative" }}>
      {isLoading && <Loading />}
      {success === true && <div>success</div>}
      {success === false && <div>error</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={style.formLogin}
      >
        <h1 className={style.tituloLogin}>Alterar senha</h1>

        <label htmlFor="newPassword" className={style.labelLogin}>
          Senha:
        </label>
        <span className={style.spanLogin}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className={style.svgLogin}
          >
            <g>
              <path d="M0,0h24v24H0V0z" fill="none" />
            </g>
            <g>
              <g>
                <path d="M2,17h20v2H2V17z M3.15,12.95L4,11.47l0.85,1.48l1.3-0.75L5.3,10.72H7v-1.5H5.3l0.85-1.47L4.85,7L4,8.47L3.15,7l-1.3,0.75 L2.7,9.22H1v1.5h1.7L1.85,12.2L3.15,12.95z M9.85,12.2l1.3,0.75L12,11.47l0.85,1.48l1.3-0.75l-0.85-1.48H15v-1.5h-1.7l0.85-1.47 L12.85,7L12,8.47L11.15,7l-1.3,0.75l0.85,1.47H9v1.5h1.7L9.85,12.2z M23,9.22h-1.7l0.85-1.47L20.85,7L20,8.47L19.15,7l-1.3,0.75 l0.85,1.47H17v1.5h1.7l-0.85,1.48l1.3,0.75L20,11.47l0.85,1.48l1.3-0.75l-0.85-1.48H23V9.22z" />
              </g>
            </g>
          </svg>
          <input
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            type="password"
            id="newPassword"
            className={style.inputLogin}
            value={newPassword}
          />
        </span>

        <div id={style.botaoLogin}>
          {/* {isIncorrectCredentials && <p>Credenciais incorretas</p>} */}
          <span
            // className={
            //   isIncorrectCredentials
            //     ? `wrongInput ${style.spanLogin}`
            //     : style.spanLogin
            // }
            className={style.spanLogin}
          >
            <button onClick={handleSubmit} className={style.botaoLogin}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="24"
                className={style.svgLogin}
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
                </g>
              </svg>
              <p className={style.pBotao}>Alterar</p>
            </button>
          </span>
        </div>

        {/* <p className={style.pLogin}>não consegue acessar?</p> */}
      </form>
    </div>
  );
}
