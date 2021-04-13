import axios from "axios";
import { useState } from "react";

import style from "../assets/css/components/projeto.module.css";

export default function Projeto({ projetoInfo, userInfo, editais }) {
  const [isHidden, setIsHidden] = useState(true);
  const [initialProjetoInfo, setInitialProjetoInfo] = useState(projetoInfo);
  const [projetoNewInfo, setProjetoNewInfo] = useState(projetoInfo);

  function handleEdit() {
    if (isHidden) {
      setProjetoNewInfo(initialProjetoInfo);
    }
    setIsHidden(!isHidden);
  }

  function handleConfirm() {
    axios
      .put("http://localhost:5000/projeto", {
        cpfUsuario: userInfo.cpf,
        id: projetoNewInfo.id,
        projetoNewInfo: projetoNewInfo,
      })
      .then((response) => {
        if (response.status === 200) {
          setInitialProjetoInfo(projetoNewInfo);
        }
      });
  }

  return (
    <div className={style.containerEditar}>
      <div className={style.containerProjeto}>
        <p className={style.nomeProjeto}>{initialProjetoInfo.nome}</p>
        <div className={style.agruparBotoes}>
          <button onClick={handleEdit}>Editar</button>
          <button>Deletar</button>
        </div>
      </div>
      <div>
        {!isHidden && (
          <div className={projetoInfo}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={style.editarProjeto}>
                <label htmlFor="nome">Nome:</label>
                <input
                  className={style.inputProjeto}
                  onChange={(e) =>
                    setProjetoNewInfo({
                      ...projetoNewInfo,
                      nome: e.target.value,
                    })
                  }
                  type="text"
                  value={projetoNewInfo.nome}
                  id="nome"
                />
                <label htmlFor="capital">Capital:</label>
                <input
                  className={style.inputProjeto}
                  onChange={(e) =>
                    setProjetoNewInfo({
                      ...projetoNewInfo,
                      valorRecebidoCapital: e.target.value,
                      valorRecebidoTotal:
                        Number(e.target.value) +
                        Number(projetoNewInfo.valorRecebidoCusteio),
                    })
                  }
                  type="number"
                  value={projetoNewInfo.valorRecebidoCapital}
                  id="capital"
                />
                <label htmlFor="custeio">Custeio:</label>
                <input
                  className={style.inputProjeto}
                  onChange={(e) =>
                    setProjetoNewInfo({
                      ...projetoNewInfo,
                      valorRecebidoCusteio: e.target.value,
                      valorRecebidoTotal:
                        Number(e.target.value) +
                        Number(projetoNewInfo.valorRecebidoCapital),
                    })
                  }
                  type="number"
                  value={projetoNewInfo.valorRecebidoCusteio}
                  id="custeio"
                />
                <label htmlFor="edital">Edital:</label>
                <select
                  className={style.inputProjeto}
                  value={projetoNewInfo.idEdital}
                  id="edital"
                  onChange={(e) => {
                    setProjetoNewInfo({
                      ...projetoNewInfo,
                      idEdital: e.target.value,
                    });
                  }}
                >
                  {editais.map((edital) => {
                    return (
                      <option key={edital.id} value={edital.id}>
                        {edital.nome}
                      </option>
                    );
                  })}
                </select>
                <span className={style.espacamento}></span>
                <button className={style.botaoProjeto} onClick={handleConfirm}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    className={style.saveProject}
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
