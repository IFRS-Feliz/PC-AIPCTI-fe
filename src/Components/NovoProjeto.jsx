// import { useState } from "react";
import { useState } from "react";
import style from "../assets/css/components/novoProjeto.module.css";

export default function NovoProjeto({
  projetos,
  setProjetos,
  index,
  editais = [], //quando estiver sendo criado durante a criacao de um usuario
  users = [], //quando estiver sendo criado durante a criacao de um edital
  setModal = () => {},
}) {
  const [nomeWasTouched, setNomeWasTouched] = useState(false);

  return (
    <form
      className={style.novoProjetoForm}
      onSubmit={(e) => e.preventDefault()}
    >
      <div
        className={
          projetos[index].nome === "" && nomeWasTouched
            ? `wrongInput ${style.novoProjetoNome}`
            : style.novoProjetoNome
        }
      >
        <input
          onChange={(e) => {
            let newProjetos = [...projetos];
            newProjetos[index].nome = e.target.value;
            setProjetos(newProjetos);
          }}
          type="text"
          value={projetos[index].nome}
          id="nome"
          placeholder="Nome do projeto"
          onBlur={() => setNomeWasTouched(true)}
        />
        <button
          onClick={(e) => {
            setModal(true);
            let newProjetos = [...projetos];
            newProjetos.splice(index, 1);
            setProjetos(newProjetos);
          }}
        >
          <svg height="1.5rem" width="1.5rem" className={style.svgNovoProjeto}>
            <path
              fill="#084C61"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </button>
      </div>
      <div className={style.novoProjetoField}>
        <label htmlFor="capital">Capital:</label>
        <input
          onChange={(e) => {
            let newProjetos = [...projetos];
            newProjetos[index].valorRecebidoCapital = Number(e.target.value);
            newProjetos[index].valorRecebidoTotal =
              Number(e.target.value) +
              Number(projetos[index].valorRecebidoCusteio);
            setProjetos(newProjetos);
          }}
          type="number"
          value={projetos[index].valorRecebidoCapital || ""}
          id="capital"
          placeholder={0}
        />
      </div>
      <div className={style.novoProjetoField}>
        <label htmlFor="custeio">Custeio:</label>
        <input
          onChange={(e) => {
            let newProjetos = [...projetos];
            newProjetos[index].valorRecebidoCusteio = Number(e.target.value);
            newProjetos[index].valorRecebidoTotal =
              Number(e.target.value) +
              Number(projetos[index].valorRecebidoCapital);
            setProjetos(newProjetos);
          }}
          type="number"
          value={projetos[index].valorRecebidoCusteio || ""}
          id="custeio"
          placeholder={0}
        />
      </div>

      {/*caso seja um projeto esteja sendo criado durante a criacao de um usuario*/}
      {editais.length > 0 && (
        <div className={style.novoProjetoField}>
          <label htmlFor="edital">Edital:</label>
          <select
            value={projetos[index].idEdital}
            id="edital"
            onChange={(e) => {
              let newProjetos = [...projetos];
              newProjetos[index].idEdital = e.target.value;
              setProjetos(newProjetos);
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
        </div>
      )}

      {/*caso seja um projeto esteja sendo criado durante a criacao de um edital*/}
      {users.length > 0 && (
        <div className={style.novoProjetoField}>
          <label htmlFor="usuario">Usuario:</label>
          <select
            value={projetos[index].cpfUsuario}
            id="usuario"
            onChange={(e) => {
              let newProjetos = [...projetos];
              newProjetos[index].cpfUsuario = e.target.value;
              setProjetos(newProjetos);
            }}
          >
            {users.map((user) => {
              return (
                <option key={user.cpf} value={user.cpf}>
                  {user.nome}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </form>
  );
}
