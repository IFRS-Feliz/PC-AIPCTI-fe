export default function NovoProjeto({ projetos, setProjetos, index, editais }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="nome">Nome:</label>
      <input
        onChange={(e) => {
          let newProjetos = [...projetos];
          newProjetos[index].nome = e.target.value;
          setProjetos(newProjetos);
        }}
        type="text"
        value={projetos[index].nome}
        id="nome"
      />
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
    </form>
  );
}
