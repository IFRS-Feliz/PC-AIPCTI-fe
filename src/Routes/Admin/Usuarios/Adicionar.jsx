import axios from "../../../axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import NovoProjeto from "../../../Components/Admin/NovoProjeto";

import style from "../../../assets/css/routes/adicionar.module.css";
import {
  handleAddProject,
  handleCPFInputChange,
  handleNomeInputChange,
  handleEmailInputChange,
  fieldsHaveErrors,
} from "../../../Helpers/EditarAdicionarUsuario";

export default function Adicionar() {
  const history = useHistory();

  const [user, setUser] = useState({ cpf: "", nome: "", email: "" });
  const [projetos, setProjetos] = useState([]);
  const [editais, setEditais] = useState([]);

  const [errors, setErrors] = useState({
    cpf: true,
    nome: true,
    email: true,
  });
  const [wasTouched, setWasTouched] = useState({
    cpf: false,
    nome: false,
    email: false,
  });

  useEffect(() => {
    axios
      .get("/edital")
      .then((response) => {
        setEditais(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleCreateUser() {
    //adicionar usuario e em seguida seus projetos
    axios
      .post("/usuario", {
        cpf: user.cpf,
        nome: user.nome,
        email: user.email,
      })
      .then(() => {
        if (projetos.length > 0) {
          //setar cpf do usuario em cada projeto
          projetos.forEach((projeto) => (projeto.cpfUsuario = user.cpf));
          //adicionar projetos
          axios
            .post("/projeto", {
              projetos: projetos,
            })
            .then(() => history.push("/admin/usuarios"))
            .catch((e) => {
              if (e.response.status === 400) {
                alert(
                  "Inputs dos projetos incorretos. O usuário foi criado, para adicionar projetos à ele, volte para a lista de usuários e começe a editá-lo."
                );
                history.push("/admin/usuarios");
              }
            });
        } else {
          history.push("/admin/usuarios");
        }
      })
      .catch((e) => {
        if (e.response.status === 400) {
          if (e.response.data) alert(e.response.data.msg);
          else alert("Inputs do usuário incorretos.");
        }
      });
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
              onBlur={() => setWasTouched({ ...wasTouched, cpf: true })}
              onChange={(e) =>
                handleCPFInputChange(e, errors, setErrors, user, setUser)
              }
              className={
                errors.cpf && wasTouched.cpf
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
              maxLength={11 + 3}
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              onBlur={() => setWasTouched({ ...wasTouched, nome: true })}
              onChange={(e) =>
                handleNomeInputChange(e, errors, setErrors, user, setUser)
              }
              className={
                errors.nome && wasTouched.nome
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              onBlur={() => setWasTouched({ ...wasTouched, email: true })}
              onChange={(e) =>
                handleEmailInputChange(e, errors, setErrors, user, setUser)
              }
              className={
                errors.email && wasTouched.email
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
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
          onClick={() => handleAddProject(editais, setProjetos, projetos)}
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
          disabled={fieldsHaveErrors(projetos, errors)}
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
