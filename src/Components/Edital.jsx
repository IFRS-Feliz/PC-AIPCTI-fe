import axios from "../axios";
import { useState } from "react";
import { Link } from "react-router-dom";

import style from "../assets/css/components/user.module.css";
import Projeto from "./Projeto";

export default function Edital({ editalInfo, todosEditais, setTodosEditais }) {
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
        .get(`projeto?idEdital=${editalInfo.id}`)
        .then((response) => setProjetos(response.data.results))
        .catch((e) => {
          if (e.response.status === 400) {
            alert("verifique o cpf no cadastro desse usuario");
          }
        });
    }
  }

  function handleDelete() {
    axios
      .delete(`/edital`, {
        data: { id: editalInfo.id },
      })
      .then(() => {
        let newEditais = todosEditais.filter(
          (edital) => edital.id !== editalInfo.id
        );
        setTodosEditais(newEditais);
      })
      .catch((e) => {
        alert("Não foi possível deleter esse edital. Tente novamente.");
      });
  }

  const dataInicio = editalInfo.dataInicio.substring(0, 10).split("-");
  const dataFim = editalInfo.dataFim.substring(0, 10).split("-");

  return (
    <div className={style.userContainer}>
      <div className={style.user}>
        <p
          className={style.pUser}
        >{`${editalInfo.nome}  |  ${dataInicio[2]}/${dataInicio[1]}/${dataInicio[0]} - ${dataFim[2]}/${dataFim[1]}/${dataFim[0]}`}</p>
        <div className={style.agruparBotoes}>
          <Link
            to={`/admin/editais/${editalInfo.id}`}
            className={style.botaoUser}
          >
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
          </Link>
          <button onClick={handleDelete} className={style.botaoUser}>
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
          {projetos.map((projeto) => {
            return (
              <Projeto
                key={projeto.id}
                projetoInfo={projeto}
                editais={todosEditais}
                projetos={projetos}
                setProjetos={setProjetos}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
