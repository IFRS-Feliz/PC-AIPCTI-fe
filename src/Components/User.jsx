import { useState } from "react";
import axios from "axios";

import Projeto from "./Projeto";
import style from "../assets/css/components/user.module.css";

axios.defaults.withCredentials = true;

export default function User({ userInfo, editais }) {
  const [projetos, setProjetos] = useState([]);
  const [arrowClass, setarrowClass] = useState(style.hidden);
  const [animation, setAnimation] = useState(style.projetosHidden);

  function mostrar() {
    if (animation === style.projetosHidden) {
      setTimeout(() => {
        setAnimation(style.projetosShow);
      }, 100);
    } else {
      setAnimation(style.projetosHidden);
    }
  }

  function rotacionar() {
    if (arrowClass === style.show) {
      setarrowClass(style.hidden);
    } else {
      setarrowClass(style.show);
    }
  }

  function handleShowProjects() {
    if (projetos.length > 0) {
      setProjetos([]);
    } else {
      axios
        .get(`http://localhost:5000/projeto?cpfUsuario=${userInfo.cpf}`)
        .then((response) => setProjetos(response.data.results));
    }
  }

  return (
    <div className={style.userContainer}>
      <div className={style.user}>
        <p className={style.pUser}>{`${userInfo.nome} - ${userInfo.cpf}`}</p>
        <div className={style.agruparBotoes}>
          <button className={style.botaoUser}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgUser}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
          <button className={style.botaoUser}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgUser}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
          <p className={style.linhaVertical}>|</p>
          <button
            onClick={() => {
              mostrar();
              rotacionar();
              handleShowProjects();
            }}
            className={style.botaoUser}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              className={style.svgUser}
              id={arrowClass}
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
              </g>
            </svg>
          </button>
        </div>
      </div>
      {projetos.length > 0 && (
        <div className={animation}>
          <div className={style.separador}></div>

          {projetos.map((projeto, index) => {
            return (
              <Projeto
                key={projeto.id}
                projetoInfo={projeto}
                userInfo={userInfo}
                editais={editais}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
