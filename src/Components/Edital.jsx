import axios from "../axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "../assets/css/components/user.module.css";
import Projeto from "./Projeto";

export default function Edital({
  editalInfo,
  todosProjetos,
  setTodosProjetos,
  todosEditais,
  setTodosEditais,
}) {
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
    //sempre atualizar a lista de todos os projetos ao visualizar
    //talvez seja muito pesado, pq todos os editais atualizam seus proprios projetos
    //quando isso acontece
    axios
      .get(`projeto`)
      .then((response) => setTodosProjetos(response.data.results))
      .catch((e) => {
        if (e.response.status === 400) {
          alert("algo de errado");
        }
      });
  }

  function handleDelete() {
    if (projetos.length === 0) {
      axios
        .delete("/edital", {
          data: { id: editalInfo.id },
        })
        .then(() => {
          let newTodosEditais = todosEditais.filter(
            (edital) => edital.id !== editalInfo.id
          );
          setTodosEditais(newTodosEditais);
        })
        .catch((e) => {
          alert("Não foi possível deleter esse edital. Tente novamente.");
        });
    }
  }

  //setar projetos do edital
  useEffect(() => {
    setProjetos(
      todosProjetos.filter((projeto) => projeto.idEdital === editalInfo.id)
    );
  }, [todosProjetos, editalInfo.id]);

  return (
    <div className={style.userContainer}>
      <div className={style.user}>
        <p
          className={style.pUser}
        >{`${editalInfo.nome}  |  ${editalInfo.dataInicio}-${editalInfo.dataFim}`}</p>
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
          <button
            disabled={projetos.length > 0}
            title={
              projetos.length > 0
                ? "Não é possível apagar editais que possuem projetos."
                : ""
            }
            onClick={handleDelete}
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
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
          <p className={style.linhaVertical}>|</p>
          <button
            disabled={projetos.length === 0}
            title={projetos.length === 0 ? "Não possui projetos." : ""}
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
                projetos={todosProjetos}
                setProjetos={setTodosProjetos}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
