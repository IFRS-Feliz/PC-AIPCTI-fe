import { useState } from "react";
import axios from "axios";

import Projeto from "./Projeto";

axios.defaults.withCredentials = true;

export default function User({ userInfo, editais }) {
  const [projetos, setProjetos] = useState([]);

  function handleShowProjects() {
    if (projetos.length > 0) {
      setProjetos([]);
    } else {
      axios
        .get(`http://localhost:5000/projeto?cpfUsuario=${userInfo.cpf}`)
        .then((response) => setProjetos(response.data.results));
    }
  }

  return (
    <div className="user">
      {`${userInfo.nome} - ${userInfo.cpf}`}
      <button>Editar</button>
      <button>Deletar</button>
      <button onClick={handleShowProjects}>Ver</button>
      {projetos.length > 0 && (
        <div className="projetos">
          {projetos.map((projeto, index) => {
            return (
              <Projeto
                key={projeto.id}
                projetoInfo={projeto}
                userInfo={userInfo}
                editais={editais}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
