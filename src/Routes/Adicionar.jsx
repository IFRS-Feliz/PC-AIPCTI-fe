import axios from "axios";
import { useEffect, useState } from "react";
import NovoProjeto from "../Components/NovoProjeto";

export default function Adicionar() {
  const [projetos, setProjetos] = useState([]);
  const [editais, setEditais] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/edital")
      .then((response) => {
        setEditais(response.data.results);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          window.location.href = "/projetos";
        } else if (e.response.status === 401) {
          window.location.href = "/login";
        }
      });
  }, []);

  function handleAddProject() {
    setProjetos([
      ...projetos,
      {
        nome: "",
        valorRecebidoCapital: "",
        valorRecebidoCusteio: "",
        valorRecebidoTotal: "",
        idEdital: 1,
      },
    ]);
  }

  return (
    <>
      <h1>Adicionar um usuário:</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="nome">Nome:</label>
        <input id="nome" type="text" />
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" />
        <label htmlFor="senha">Senha:</label>
        <input id="senha" type="password" />
      </form>

      <hr></hr>

      {projetos.length > 0 &&
        projetos.map((projeto, index) => {
          return (
            <NovoProjeto
              key={index}
              projetos={projetos}
              setProjetos={setProjetos}
              index={index}
              editais={editais}
            />
          );
        })}

      <button onClick={handleAddProject}>+</button>
      <button onClick={() => console.log(projetos)}>projetos</button>
    </>
  );
}
