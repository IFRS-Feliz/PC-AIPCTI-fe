import axios from "axios";
import { useState } from "react";

import style from "../assets/css/routes/login.module.css";

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    axios
      .post("http://localhost:5000/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.isAdmin === 1) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/projetos";
        }
      })
      .catch((err) => {
        //mostrar credenciais erradas
      });
  }

  return (
    <>
      <div className={style.containerLogin}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className={style.formLogin}
        >
          <h1 className={style.tituloLogin}>Login</h1>
          <label htmlFor="email" className={style.labelLogin}>
            E-mail:
          </label>

          <span className={style.spanLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgLogin}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" />
            </svg>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              className={style.inputLogin}
            />
          </span>

          <label htmlFor="password" className={style.labelLogin}>
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
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              className={style.inputLogin}
            />
          </span>

          <span className={style.spanLogin} id={style.botaoLogin}>
            <button onClick={handleLogin} className={style.botaoLogin}>
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
              <p className={style.pBotao}>Login</p>
            </button>
          </span>

          <p className={style.pLogin}>não consegue acessar?</p>
        </form>
      </div>
    </>
  );
}
