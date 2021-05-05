import axios from "../../../axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  handleNomeInputChange,
  handleAddProject,
  fieldsHaveErrors,
  handleDataFimInputChange,
  handleDataInicioInputChange,
  getProjectArrays,
  handleDataLimiteInputChange,
} from "../../../Helpers/EditarAdicionarUsuario";
import NovoProjeto from "../../../Components/Admin/NovoProjeto";

import style from "../../../assets/css/routes/adicionar.module.css";

export default function Editar() {
  const history = useHistory();
  const { id } = useParams();
  const [edital, setEdital] = useState({
    id: id,
    nome: "",
    dataInicio: "",
    dataFim: "",
    valorAIPCTI: 0,
    dataLimitePrestacao: "",
  });
  const [initialProjetos, setInitialProjetos] = useState([]);
  const [newProjetos, setNewProjetos] = useState([]);

  const [usuarios, setUsuarios] = useState([]);

  const [errors, setErrors] = useState({
    nome: false,
    dataInicio: false,
    dataFim: false,
    valorAIPCTI: false,
    dataLimitePrestacao: false,
  });
  const [wasTouched, setWasTouched] = useState({
    nome: false,
    dataInicio: false,
    dataFim: false,
    valorAIPCTI: false,
    dataLimitePrestacao: false,
  });

  useEffect(() => {
    //requisitar edital para editar
    axios
      .get(`/edital/${id}`)
      .then((response) => {
        if (response.data.results.length === 1) {
          //formatar datas
          response.data.results[0].dataInicio = response.data.results[0].dataInicio.substring(
            0,
            10
          );
          response.data.results[0].dataFim = response.data.results[0].dataFim.substring(
            0,
            10
          );
          response.data.results[0].dataLimitePrestacao = response.data.results[0].dataLimitePrestacao.substring(
            0,
            10
          );
          setEdital(response.data.results[0]);

          //requisitar projetos do edital
          axios
            .get(`/projeto?idEdital=${id}`)
            .then((response) => {
              setInitialProjetos(response.data.results);
              setNewProjetos(response.data.results);

              //requisitar usuarios
              axios
                .get("/usuario")
                .then((response) => {
                  setUsuarios(response.data.results);
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          history.push("/admin/editais");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id, history]);

  const [showStatus, setShowStatus] = useState(false);
  const [sendDataStatus, setSendDataStatus] = useState({
    postEdital: "",
    postProjetos: "",
    putProjetos: "",
    deleteProjetos: "",
  });

  function handleSave() {
    const {
      addedProjects,
      updatedProjects,
      deletedProjects,
    } = getProjectArrays(initialProjetos, newProjetos);

    async function sendData() {
      const ano = edital.dataInicio.substring(0, 4);
      let failed = {};
      await axios
        .put("/edital", {
          id: id,
          nome: edital.nome,
          dataInicio: edital.dataInicio,
          dataFim: edital.dataFim,
          valorAIPCTI: edital.valorAIPCTI,
          ano: ano,
          dataLimitePrestacao: edital.dataLimitePrestacao,
        })
        .catch(() => (failed.postEdital = true));

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
        history.push("/admin/editais");
      } else {
        //setar o que aparecerá no modal de status
        setSendDataStatus({
          postEdital: failed.postEdital ? "Erro, tente novamente" : "Ok",
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
    <>
      <div className={style.containerAdicionar}>
        {showStatus && (
          <div className={style.modalStatus}>
            <div>Status do envio das edições:</div>
            <div>Dados do edital: {sendDataStatus.postEdital}</div>
            <div>Novos projetos: {sendDataStatus.postProjetos}</div>
            <div>Dados dos projetos: {sendDataStatus.putProjetos}</div>
            <div>Projetos deletados: {sendDataStatus.deleteProjetos}</div>
          </div>
        )}
        <h1 className={style.adicionarH1}>Editar informações do edital:</h1>
        <form
          className={style.adicionarUserForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={style.adicionarUserFormField}>
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              onBlur={() => setWasTouched({ ...wasTouched, nome: true })}
              onChange={(e) =>
                handleNomeInputChange(e, errors, setErrors, edital, setEdital)
              }
              value={edital.nome}
              className={
                errors.nome && wasTouched.nome
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="dataInicio">Data de início:</label>
            <input
              id="dataInicio"
              type="date"
              onBlur={() => setWasTouched({ ...wasTouched, dataInicio: true })}
              onChange={(e) =>
                handleDataInicioInputChange(
                  e,
                  errors,
                  setErrors,
                  edital,
                  setEdital
                )
              }
              value={edital.dataInicio}
              className={
                errors.dataInicio && wasTouched.dataInicio
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="dataFim">Data de fim:</label>
            <input
              id="dataFim"
              type="date"
              onBlur={() => setWasTouched({ ...wasTouched, dataFim: true })}
              onChange={(e) =>
                handleDataFimInputChange(
                  e,
                  errors,
                  setErrors,
                  edital,
                  setEdital
                )
              }
              value={edital.dataFim}
              className={
                errors.dataFim && wasTouched.dataFim
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="dataLimitePrestacao">
              Data de limite para prestação de contas:
            </label>
            <input
              id="dataLimitePrestacao"
              type="date"
              onBlur={() =>
                setWasTouched({ ...wasTouched, dataLimitePrestacao: true })
              }
              onChange={(e) =>
                handleDataLimiteInputChange(
                  e,
                  errors,
                  setErrors,
                  edital,
                  setEdital
                )
              }
              value={edital.dataLimitePrestacao}
              className={
                errors.dataLimitePrestacao && wasTouched.dataLimitePrestacao
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="valorAIPCTI">Valor AIPCTI:</label>
            <input
              id="valorAIPCTI"
              type="number"
              onBlur={() => setWasTouched({ ...wasTouched, valorAIPCTI: true })}
              onChange={(e) =>
                setEdital({ ...edital, valorAIPCTI: Number(e.target.value) })
              }
              value={edital.valorAIPCTI || ""} //se for zero, mostrar placeholder
              placeholder={0}
              className={
                errors.valorAIPCTI && wasTouched.valorAIPCTI
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
        </form>

        <hr className={style.adicionarHr}></hr>

        <h1 className={style.adicionarH1}>Projetos do edital:</h1>

        {newProjetos.length > 0 &&
          newProjetos.map((projeto, index) => {
            return (
              <NovoProjeto
                key={index}
                projetos={newProjetos}
                setProjetos={setNewProjetos}
                index={index}
                users={usuarios}
              />
            );
          })}

        <button
          className={style.adicionarBotaoMaisProjeto}
          onClick={() =>
            handleAddProject(usuarios, setNewProjetos, newProjetos, "", id)
          }
        >
          <svg height="1.5rem" width="1.5rem">
            <path
              fill="#FFFFFF"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            />
          </svg>
          <p>Projeto</p>
        </button>

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
    </>
  );
}
