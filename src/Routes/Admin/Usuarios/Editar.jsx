import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import style from "../../../assets/css/routes/adicionar.module.css";
import NovoProjeto from "../../../Components/Admin/NovoProjeto";
import {
  handleAddProject,
  handleNomeInputChange,
  handleEmailInputChange,
  fieldsHaveErrors,
  getProjectArrays,
} from "../../../Helpers/EditarAdicionarUsuario";

export default function Editar() {
  const history = useHistory();
  const { cpf } = useParams();
  const [user, setUser] = useState({ cpf: cpf, nome: "", email: "" });

  const [initialProjetos, setInitialProjetos] = useState([]);
  const [newProjetos, setNewProjetos] = useState([]);

  const [editais, setEditais] = useState([]);

  const [errors, setErrors] = useState({
    cpf: false,
    nome: false,
    email: false,
  });
  const [wasTouched, setWasTouched] = useState({
    cpf: false,
    nome: false,
    email: false,
  });

  const [showStatus, setShowStatus] = useState(false);
  const [sendDataStatus, setSendDataStatus] = useState({
    postUsuario: "",
    postProjetos: "",
    putProjetos: "",
    deleteProjetos: "",
  });

  useEffect(() => {
    if (cpf.length === 11 && !isNaN(cpf)) {
      //requisitar informacoes do usuario para edita-lo
      axios
        .get(`/usuario/${cpf}`)
        .then((response) => {
          if (response.data.results.length === 1) {
            if (response.data.results[0].isAdmin === 1) {
              history.push("/admin/usuarios");
            } else {
              setUser(response.data.results[0]);

              //requisitar projetos do usuario
              axios
                .get(`/projeto?cpfUsuario=${cpf}`)
                .then((response) => {
                  setInitialProjetos(response.data.results);
                  setNewProjetos(response.data.results);

                  //requisitar editais //devia provavelmente fazer dos editais um contexto no futuro
                  axios
                    .get("/edital")
                    .then((response) => {
                      setEditais(response.data.results);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          } else history.push("/admin/usuarios");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      history.push("/admin/usuarios");
    }
  }, [history, cpf]); //adicionado cpf e history no array de dependencias para remover warning

  function handleSave() {
    const {
      addedProjects,
      updatedProjects,
      deletedProjects,
    } = getProjectArrays(initialProjetos, newProjetos);

    async function sendData() {
      let failed = {};
      await axios
        .put("/usuario", {
          cpf: user.cpf,
          email: user.email,
          nome: user.nome,
        })
        .catch(() => (failed.postUsuario = true));

      if (addedProjects.length > 0) {
        await axios
          .post("/projeto", {
            projetos: addedProjects,
          })
          .catch(() => (failed.postProjetos = true));
      }

      if (updatedProjects.length > 0) {
        await axios
          .put("/projeto", {
            projetos: updatedProjects,
          })
          .catch(() => (failed.putProjetos = true));
      }

      if (deletedProjects.length > 0) {
        await axios
          .delete("/projeto", {
            data: { projetos: deletedProjects },
          })
          .catch(() => (failed.deleteUsuario = true));
      }

      //caso nao haja nenhum erro, redirecionar
      if (Object.values(failed).length === 0) {
        history.push("/admin/usuarios");
      } else {
        //setar o que aparecerá no modal de status
        setSendDataStatus({
          postUsuario: failed.postUsuario ? "Erro, tente novamente" : "Ok",
          postProjetos: failed.postProjetos ? "Erro, tente novamente" : "Ok",
          putProjetos: failed.putProjetos ? "Erro, tente novamente" : "Ok",
          deleteProjetos: failed.deleteProjetos
            ? "Erro, tente novamente"
            : "Ok",
        });
        //mostrar modal com os status e remover apos 5 segundos
        setShowStatus(true);
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
      }
    }

    sendData();
  }

  return (
    <div className={style.containerAdicionar}>
      {showStatus && (
        <div className={style.modalStatus}>
          <div>Status do envio das edições:</div>
          <div>Dados do usuário: {sendDataStatus.postUsuario}</div>
          <div>Novos projetos: {sendDataStatus.postProjetos}</div>
          <div>Dados dos projetos: {sendDataStatus.putProjetos}</div>
          <div>Projetos deletados: {sendDataStatus.deleteProjetos}</div>
        </div>
      )}
      <h1 className={style.adicionarH1}>Editar informações do usuário:</h1>
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
            readOnly={true}
            //linhas abaixo comentadas pelo cpf ser atualmente não editavel
            // onBlur={() => setWasTouched({ ...wasTouched, cpf: true })}
            // onChange={(e) => handleCPFInputChange(e)}
            className={
              // errors.cpf && wasTouched.cpf
              //   ? `wrongInput ${style.normalInput}`
              //   :
              style.normalInput
            }
            // maxLength={11 + 3}
            value={cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")} //formatar valor inicial com regex
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
            value={user.nome}
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
            value={user.email}
          />
        </div>
      </form>

      <hr className={style.adicionarHr}></hr>

      <h1 className={style.adicionarH1}>Projetos do usuário:</h1>

      {newProjetos.length > 0 &&
        newProjetos.map((projeto, index) => {
          return (
            <NovoProjeto
              key={index}
              projetos={newProjetos}
              setProjetos={setNewProjetos}
              index={index}
              editais={editais}
            />
          );
        })}

      <button
        onClick={() =>
          handleAddProject(editais, setNewProjetos, newProjetos, cpf)
        }
        className={style.adicionarBotaoMaisProjeto}
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
        disabled={fieldsHaveErrors(newProjetos, errors)}
        className={style.adicionarBotaoCriarUsuario}
        onClick={handleSave}
      >
        <svg height="24px" width="24px">
          <path
            d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"
            fill="#FFFFFF"
          />
        </svg>
      </button>
    </div>
  );
}
