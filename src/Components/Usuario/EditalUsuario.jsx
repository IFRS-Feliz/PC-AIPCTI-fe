import { useState, useEffect } from "react";

import style from "../../assets/css/components/user.module.css";
import ProjetoUsuario from "./ProjetoUsuario";

export default function EditalUsuario({
  editalInfo,
  todosProjetos,
  setTodosProjetos,
  todosEditais,
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

  //setar projetos do edital
  useEffect(() => {
    setProjetos(
      todosProjetos.filter((projeto) => projeto.idEdital === editalInfo.id)
    );
  }, [todosProjetos, editalInfo.id]);

  // const dataInicio = editalInfo.dataInicio.substring(0, 10).split("-");
  //const dataFim = editalInfo.dataFim.substring(0, 10).split("-");
  const dataLimite = editalInfo.dataLimitePrestacao.substring(0, 10).split("-");

  return (
    <div className={style.userContainer}>
      <div className={style.user}>
        <p
          className={style.pUser}
        >{`${editalInfo.nome}  |  Limite para prestação de contas: ${dataLimite[2]}/${dataLimite[1]}/${dataLimite[0]}`}</p>
        <div className={style.agruparBotoes}>
          <p className={style.linhaVertical}>|</p>

          <button
            disabled={projetos.length === 0}
            title={projetos.length === 0 ? "Não possui projetos." : ""}
            onClick={() => {
              mostrar();
              rotacionar();
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
              <ProjetoUsuario
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
