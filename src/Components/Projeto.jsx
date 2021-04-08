import axios from "axios";
import { useState } from "react";

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
    <div className="projeto">
      {initialProjetoInfo.nome}
      <button onClick={handleEdit}>Editar</button>
      <button>Deletar</button>
      {!isHidden && (
        <div className="projetoInfo">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="nome">Nome:</label>
            <input
              onChange={(e) =>
                setProjetoNewInfo({ ...projetoNewInfo, nome: e.target.value })
              }
              type="text"
              value={projetoNewInfo.nome}
              id="nome"
            />
            <label htmlFor="capital">Capital:</label>
            <input
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
            <button onClick={handleConfirm}>Confirmar</button>
          </form>
        </div>
      )}
    </div>
  );
}
