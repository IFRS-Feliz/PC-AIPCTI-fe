import { useState } from "react";
import { Link } from "react-router-dom";

import style from "../../assets/css/components/projeto.module.css";

export default function Projeto({ projetoInfo, isMain = false }) {
  const [initialProjetoInfo] = useState(projetoInfo);
  const [teste, setTeste] = useState(style.mostradorHidden);

  function animacao() {
    if (teste === style.mostradorShow) {
      setTeste(style.mostradorHidden);
    } else {
      setTeste(style.mostradorShow);
    }
  }

  return (
    <div className={isMain ? style.containerEditarMain : style.containerEditar}>
      <div
        className={isMain ? style.containerProjetoMain : style.containerProjeto}
      >
        <p className={style.nomeProjeto}>{initialProjetoInfo.nome}</p>
        <div className={style.agruparBotoes}>
          <button
            onClick={() => {
              animacao();
            }}
            className={style.removerEstilo}
            id={style.botaoEditar}
          >
            <svg
              className={style.svgProjeto}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`${teste}`}>
        <div className={projetoInfo}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={style.editarProjeto}>
              <div className={style.row}>
                <label htmlFor="capital" className={style.labelProjeto}>
                  Capital:
                </label>
                <input
                  disabled
                  className={style.inputProjeto}
                  type="number"
                  value={initialProjetoInfo.valorRecebidoCapital || ""} //se for zero, mostrar placeholder para nao travar input
                  placeholder={0}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="custeio" className={style.labelProjeto}>
                  Custeio:
                </label>
                <input
                  disabled
                  className={style.inputProjeto}
                  type="number"
                  value={initialProjetoInfo.valorRecebidoCusteio || ""} //se for zero, mostrar placeholder para nao travar input
                  placeholder={0}
                />
              </div>

              <Link
                to={`/projetos/${initialProjetoInfo.id}`}
                className={style.gerarRelatorio}
              >
                <p>Prestar contas</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
