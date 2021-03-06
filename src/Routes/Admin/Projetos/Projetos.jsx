import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";

import Projeto from "../../../Components/Admin/Projeto";

import style from "../../../assets/css/routes/usuarios.module.css";
import NovoProjeto from "../../../Components/Admin/NovoProjeto";
import { useRef } from "react";
import Paginacao, { SortOptions } from "../../../Components/Paginacao";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);

  const [searchResults, setSearchResults] = useState(projetos);
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, SetNextPage] = useState({});

  const [novoProjeto, setNovoProjeto] = useState([{ nome: "" }]);
  const [modal, setModal] = useState(true);

  const filterRef = useRef(null);
  const [sortBy, setSortBy] = useState("nome"); //id | nome
  const [order, setOrder] = useState("ASC"); //ASC | DESC

  useEffect(() => {
    axios
      .get(
        `/projeto?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        setProjetos(response.data.results);
        SetNextPage(response.data.next);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage, sortBy, order]);

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
  }, []);

  useEffect(() => {
    //manter search results sempre em sync
    setSearchResults(projetos);
    filterRef.current.value = "";
  }, [projetos]);

  let typingTimer;
  function handleFilterChange(e) {
    function finishedTyping() {
      axios
        .get(`/search/projeto?q=${e.target.value}`)
        .then((response) => {
          setSearchResults(response.data.results);
        })
        .catch((e) => console.log(e));
    }

    clearTimeout(typingTimer);
    if (e.target.value) {
      typingTimer = setTimeout(finishedTyping, 1000);
    } else setSearchResults(projetos);
  }

  function handleCreateProject() {
    console.log(novoProjeto);
    axios
      .post("/projeto", { projetos: novoProjeto })
      .then((response) => {
        console.log(response);
        setProjetos([
          ...projetos,
          { ...novoProjeto[0], id: response.data.results[0].id },
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
            placeholder="Filtrar por nome"
            className={style.filtrar}
            onChange={(e) => handleFilterChange(e)}
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

      <div
        style={{ margin: "auto", display: "flex", justifyContent: "center" }}
      >
        <SortOptions
          setSortBy={setSortBy}
          setOrder={setOrder}
          sortBy={sortBy}
          order={order}
          options={["id", "nome"]}
        />
      </div>

      {/*verificacao para prevenir bug nas listas de editais e usuarios. 
      nao muda nada ja que nunca haverao projetos sem editais ou usuarios.*/}
      {users.length > 0 && editais.length > 0 && (
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
                  users={users}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* paginacao */}
      {projetos === searchResults && ( //somente mostrar paginacao quando nao filtrando
        <Paginacao
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          nextPage={nextPage}
        />
      )}
    </>
  );
}
