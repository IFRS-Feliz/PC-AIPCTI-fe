import style from "../assets/css/components/novoProjeto.module.css";

export default function NovoProjeto({ projetos, setProjetos, index, editais }) {
  return (
    <form
      className={style.novoProjetoForm}
      onSubmit={(e) => e.preventDefault()}
    >
      {/* <label htmlFor="nome">Nome:</label> */}
      <div className={style.novoProjetoNome}>
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
        />
        <button
          onClick={(e) => {
            let newProjetos = [...projetos];
            newProjetos.splice(index, 1);
            setProjetos(newProjetos);
          }}
        >
          <svg height="1.5rem" width="1.5rem">
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
            newProjetos[index].valorRecebidoCapital = e.target.value;
            newProjetos[index].valorRecebidoTotal =
              e.target.value + projetos[index].valorRecebidoCusteio;
            setProjetos(newProjetos);
          }}
          type="number"
          value={projetos[index].valorRecebidoCapital}
          id="capital"
        />
      </div>
      <div className={style.novoProjetoField}>
        <label htmlFor="custeio">Custeio:</label>
        <input
          onChange={(e) => {
            let newProjetos = [...projetos];
            newProjetos[index].valorRecebidoCusteio = e.target.value;
            newProjetos[index].valorRecebidoTotal =
              e.target.value + projetos[index].valorRecebidoCapital;
            setProjetos(newProjetos);
          }}
          type="number"
          value={projetos[index].valorRecebidoCusteio}
          id="custeio"
        />
      </div>
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
    </form>
  );
}
