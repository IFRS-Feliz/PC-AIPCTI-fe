import axios from "../../../axios";
import {
  handleNomeInputChange,
  fieldsHaveErrors,
  handleAddProject,
  handleDataFimInputChange,
  handleDataInicioInputChange,
} from "../../../Helpers/EditarAdicionarUsuario";
import NovoProjeto from "../../../Components/NovoProjeto";
import { useState, useEffect } from "react";

import style from "../../../assets/css/routes/adicionar.module.css";
import { useHistory } from "react-router";

export default function Adicionar() {
  const history = useHistory();
  const [edital, setEdital] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
    valorIPCT: 0,
  });
  const [projetos, setProjetos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [errors, setErrors] = useState({
    nome: true,
    dataInicio: true,
    dataFim: true,
    valorIPCT: false,
  });
  const [wasTouched, setWasTouched] = useState({
    nome: false,
    dataInicio: false,
    dataFim: false,
    valorIPCT: false,
  });

  useEffect(() => {
    axios
      .get("/usuario")
      .then((response) => {
        setUsuarios(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleCreateEdital() {
    const ano = edital.dataInicio.substring(0, 4);
    console.log(ano);
    axios
      .post("/edital", {
        nome: edital.nome,
        dataInicio: edital.dataInicio,
        dataFim: edital.dataFim,
        valorIPCT: edital.valorIPCT,
        ano: ano,
      })
      .then((response) => {
        if (projetos.length > 0) {
          const idEdital = response.data.results.insertId;
          projetos.forEach((projeto) => (projeto.idEdital = idEdital));
          axios
            .post("/projeto", { projetos: projetos })
            .then(() => {
              history.push("/admin/usuarios");
            })
            .catch((e) => {
              alert(
                "Nao foi possivel adicionar os projetos ao edital. Tente novamente."
              );
            });
        } else history.push("/admin/usuarios");
      })
      .catch((e) => {
        alert("Nao foi possivel adicionar o edital. Tente novamente.");
      });
  }

  return (
    <>
      <div className={style.containerAdicionar}>
        <h1 className={style.adicionarH1}>Adicionar um edital:</h1>
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
            <label htmlFor="dataFim">Data de início:</label>
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
            <label htmlFor="valorIPCT">Valor IPCT:</label>
            <input
              id="valorIPCT"
              type="number"
              onBlur={() => setWasTouched({ ...wasTouched, valorIPCT: true })}
              onChange={(e) =>
                setEdital({ ...edital, valorIPCT: Number(e.target.value) })
              }
              value={edital.valorIPCT || ""} //se for zero, mostrar placeholder
              placeholder={0}
              className={
                errors.valorIPCT && wasTouched.valorIPCT
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
        </form>

        <hr className={style.adicionarHr}></hr>

        <h1 className={style.adicionarH1}>Projetos do edital:</h1>

        {projetos.length > 0 &&
          projetos.map((projeto, index) => {
            return (
              <NovoProjeto
                key={index}
                projetos={projetos}
                setProjetos={setProjetos}
                index={index}
                users={usuarios}
              />
            );
          })}

        <button
          className={style.adicionarBotaoMaisProjeto}
          onClick={() => handleAddProject(usuarios, setProjetos, projetos)}
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
          onClick={handleCreateEdital}
        >
          <svg height="1.5rem" width="1.5rem" fill="#FFFFFF">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </>
  );
}
