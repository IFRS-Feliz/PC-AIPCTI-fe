import axios from "../../axios";
import { useRef, useState } from "react";

import style from "../../assets/css/components/projeto.module.css";

export default function Projeto({
  projetoInfo,
  editais = [],
  users = [],
  projetos,
  setProjetos,
  isMain = false,
}) {
  const [isHidden, setIsHidden] = useState(true);
  const [initialProjetoInfo, setInitialProjetoInfo] = useState(projetoInfo);
  const [projetoNewInfo, setProjetoNewInfo] = useState(projetoInfo);

  const [listas, setListas] = useState({
    usuario: users,
    edital: editais,
  });

  const [teste, setTeste] = useState(style.teste);

  const listasRefs = { usuario: useRef(), edital: useRef() };

  function animacao() {
    if (teste === style.teste2) {
      setTeste(style.teste);
    } else {
      setTeste(style.teste2);
    }
  }

  function handleEdit() {
    if (isHidden) {
      setProjetoNewInfo(initialProjetoInfo);
    }
    setIsHidden(!isHidden);
  }

  function handleConfirm() {
    axios
      .put("/projeto", {
        projetos: [projetoNewInfo],
      })
      .then(() => {
        setInitialProjetoInfo(projetoNewInfo);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          alert("Inputs do projeto incorretos");
        } else {
          console.log(e);
        }
      });
  }

  function handleDelete() {
    axios
      .delete("/projeto", { data: { projetos: [{ id: projetoInfo.id }] } })
      .then((result) => {
        setProjetos(
          projetos.filter((projeto) => projeto.id !== projetoInfo.id)
        );
      })
      .catch((e) => {
        alert("Nao foi possivel remover o projeto. Tente novamente.");
      });
  }

  let typingTimer;
  function handleFilterChange(e, model) {
    function finishedTyping() {
      axios
        .get(`/search/${model}?q=${e.target.value}`)
        .then((response) => {
          //setar listas na posicao do model com a lista filtrada
          let newListas = { ...listas };
          newListas[model] = response.data.results;
          setListas(newListas);

          //disparar onChange no select para mudar seu value caso o option atual mude
          listasRefs[model].current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }

    clearTimeout(typingTimer);
    if (e.target.value) {
      typingTimer = setTimeout(finishedTyping, 1000);
    } //resetar
    else {
      //resetar
      let newListas = { ...listas };
      if (model === "edital") newListas[model] = editais;
      else if (model === "usuario") newListas[model] = users;
      setListas(newListas);
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
              handleEdit();
              animacao();
            }}
            className={style.removerEstilo}
            id={style.botaoEditar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgProjeto}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
          <button className={style.removerEstilo} onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgProjeto}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={teste}>
        {!isHidden && (
          <div className={projetoInfo}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={style.editarProjeto}>
                <div className={style.row}>
                  <label htmlFor="nome" className={style.labelProjeto}>
                    Nome:
                  </label>
                  <input
                    className={
                      projetoNewInfo.nome.length === 0
                        ? `wrongInput ${style.inputProjeto}`
                        : style.inputProjeto
                    }
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
                </div>
                <div className={style.row}>
                  <label htmlFor="capital" className={style.labelProjeto}>
                    Capital:
                  </label>
                  <input
                    className={style.inputProjeto}
                    onChange={(e) =>
                      setProjetoNewInfo({
                        ...projetoNewInfo,
                        valorRecebidoCapital: Number(e.target.value),
                        valorRecebidoTotal:
                          Number(e.target.value) +
                          Number(projetoNewInfo.valorRecebidoCusteio),
                      })
                    }
                    type="number"
                    value={projetoNewInfo.valorRecebidoCapital || ""} //se for zero, mostrar placeholder para nao travar input
                    id="capital"
                    placeholder={0}
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="custeio" className={style.labelProjeto}>
                    Custeio:
                  </label>
                  <input
                    className={style.inputProjeto}
                    onChange={(e) =>
                      setProjetoNewInfo({
                        ...projetoNewInfo,
                        valorRecebidoCusteio: Number(e.target.value),
                        valorRecebidoTotal:
                          Number(e.target.value) +
                          Number(projetoNewInfo.valorRecebidoCapital),
                      })
                    }
                    type="number"
                    value={projetoNewInfo.valorRecebidoCusteio || ""} //se for zero, mostrar placeholder para nao travar input
                    id="custeio"
                    placeholder={0}
                  />
                </div>

                {/*caso seja um projeto esteja sendo mostrado dentro de um usuario
                ou na pagina de projetos*/}
                {editais.length > 0 && (
                  <div className={`${style.row} ${style.rowComFilter}`}>
                    <label htmlFor="edital" className={style.labelProjeto}>
                      Edital:
                    </label>
                    <select
                      className={style.inputProjeto}
                      value={projetoNewInfo.idEdital}
                      id="edital"
                      ref={listasRefs.edital}
                      onChange={(e) => {
                        setProjetoNewInfo({
                          ...projetoNewInfo,
                          idEdital: e.target.value,
                        });
                      }}
                    >
                      {listas.edital.map((edital) => {
                        return (
                          <option key={edital.id} value={edital.id}>
                            {edital.nome}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      onChange={(e) => handleFilterChange(e, "edital")}
                      type="text"
                      className={style.inputProjeto}
                      placeholder="Filtrar editais"
                    />
                  </div>
                )}

                {/*caso seja um projeto esteja sendo mostrado dentro de um edital
                ou na pagina de projetos*/}
                {users.length > 0 && (
                  <div className={`${style.row} ${style.rowComFilter}`}>
                    <label htmlFor="usuario" className={style.labelProjeto}>
                      Usuário:
                    </label>
                    <select
                      ref={listasRefs.usuario}
                      className={style.inputProjeto}
                      value={projetoNewInfo.cpfUsuario}
                      id="usuario"
                      onChange={(e) => {
                        setProjetoNewInfo({
                          ...projetoNewInfo,
                          cpfUsuario: e.target.value,
                        });
                      }}
                    >
                      {listas.usuario.map((user) => {
                        return (
                          <option key={user.cpf} value={user.cpf}>
                            {user.nome}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      onChange={(e) => handleFilterChange(e, "usuario")}
                      type="text"
                      className={style.inputProjeto}
                      placeholder="Filtrar usuários"
                    />
                  </div>
                )}

                <span className={style.espacamento}></span>
                <button
                  className={style.botaoProjeto}
                  onClick={handleConfirm}
                  disabled={projetoNewInfo.nome.length === 0}
                >
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
