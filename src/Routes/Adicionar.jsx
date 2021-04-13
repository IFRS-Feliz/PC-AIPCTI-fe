import axios from "../axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import NovoProjeto from "../Components/NovoProjeto";

import style from "../assets/css/routes/adicionar.module.css";

export default function Adicionar() {
  const history = useHistory();

  const [user, setUser] = useState({});
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
          history.replace("/projetos");
        } else if (e.response.status === 401) {
          history.replace("/login");
        }
      });
  }, [history]); //history nas dependencias para tirar warning

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

  function handleCreateUser() {
    console.log(user.nome);
    axios
      .post("http://localhost:5000/usuario", {
        cpf: user.cpf,
        nome: user.nome,
        email: user.email,
        isAdmin: false,
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .post("http://localhost:5000/projeto", {
        cpfUsuario: user.cpf,
        projetos: projetos,
      })
      .catch((e) => {
        console.log(e);
      });

    history.push("/admin");
  }

  return (
    <>
      <div className={style.containerAdicionar}>
        <h1 className={style.adicionarH1}>Adicionar um usuário:</h1>
        <form
          className={style.adicionarUserForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={style.adicionarUserFormField}>
            <label htmlFor="cpf">CPF:</label>
            <input
              id="cpf"
              type="text"
              onChange={(e) => setUser({ ...user, cpf: e.target.value })}
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
        </form>

        <hr className={style.adicionarHr}></hr>

        <h1 className={style.adicionarH1}>Projetos do usuário:</h1>

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

        <button
          className={style.adicionarBotaoMaisProjeto}
          onClick={handleAddProject}
        >
          <svg height="1.5rem" width="1.5rem">
            <path
              fill="#FFFFFF"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            />
          </svg>
          <p>Projeto</p>
        </button>
        {/* <button onClick={() => console.log(projetos)}>loggar projetos</button> */}
        <button
          className={style.adicionarBotaoCriarUsuario}
          onClick={handleCreateUser}
        >
          <svg height="1.5rem" width="1.5rem" fill="#FFFFFF">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </>
  );
}
