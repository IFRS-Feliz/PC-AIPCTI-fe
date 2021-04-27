import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";

import Projeto from "../../../Components/Projeto";

import style from "../../../assets/css/routes/usuarios.module.css";
import NovoProjeto from "../../../Components/NovoProjeto";
import { useRef } from "react";

export default function Projetos() {
  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [searchResults, setSearchResults] = useState(projetos);
  const [novoProjeto, setNovoProjeto] = useState([{ nome: "" }]);
  const [modal, setModal] = useState(true);

  const filterRef = useRef(null);

  useEffect(() => {
    axios
      .get("/usuario")
      .then((response) => {
        setUsers(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get("/edital")
      .then((response) => {
        setEditais(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get("/projeto")
      .then((response) => {
        setProjetos(response.data.results);
        setSearchResults(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleFilterChange(inputValue) {
    //filtrar por projeto
    setSearchResults(
      projetos.filter((projeto) => projeto.nome.includes(inputValue))
    );
  }

  useEffect(() => {
    setSearchResults(projetos.filter((projeto) => projeto.nome.includes("")));
    filterRef.current.value = "";
  }, [projetos]);

  function handleCreateProject() {
    console.log(novoProjeto);
    axios
      .post("/projeto", { projetos: novoProjeto })
      .then((response) => {
        console.log(response);
        setProjetos([
          ...projetos,
          { ...novoProjeto[0], id: response.data.results.insertId },
        ]);
        setModal(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      {!modal && (
        <div className={style.containerProjetoProjetos}>
          <span
            className={style.modalProjeto}
            id="spanModal"
            onMouseDown={(e) => {
              if (e.target.id === "spanModal") {
                setModal(true);
              }
            }}
          >
            <div className={style.adicionarProjetoProjetos}>
              <NovoProjeto
                projetos={novoProjeto}
                setProjetos={setNovoProjeto}
                index={0}
                editais={editais}
                users={users}
                setModal={setModal}
              />
            </div>
            <button
              disabled={novoProjeto[0].nome === ""}
              className={style.botaoModal}
              onClick={() => {
                handleCreateProject();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </span>
        </div>
      )}

      <h1 className={style.h1}>Projetos</h1>
      <div className={style.container}>
        <div className={style.filtrarContainer}>
          <input
            type="text"
            placeholder="Filtrar por algo"
            className={style.filtrar}
            onChange={(e) => handleFilterChange(e.target.value)}
            ref={filterRef}
          />

          <button
            className={style.addAdmin}
            disabled={users.length === 0 || editais.length === 0}
            onClick={() => {
              setModal(false);
              setNovoProjeto([
                {
                  nome: "",
                  valorRecebidoCapital: 0,
                  valorRecebidoCusteio: 0,
                  valorRecebidoTotal: 0,
                  idEdital: editais[0].id,
                  cpfUsuario: users[0].cpf,
                },
              ]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className={style.svgAdmin}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={style.containerProjetos}>
        {searchResults.map((projeto) => {
          return (
            <div className={style.centralizarProjetos} key={projeto.id}>
              <Projeto
                projetoInfo={projeto}
                editais={editais}
                projetos={projetos}
                setProjetos={setProjetos}
                isMain={true}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
