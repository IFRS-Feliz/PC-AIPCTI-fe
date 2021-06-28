import axios from "../../axios";
import { useEffect, useContext, useRef, useState } from "react";
import AuthContext from "../../Contexts/Auth";
import EditalUsuario from "../../Components/Usuario/EditalUsuario";
import Loading from "../../Components/Loading";

import style from "../../assets/css/routes/usuarios.module.css";

export default function Projetos() {
  const { user } = useContext(AuthContext);
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [searchResults, setSearchResults] = useState(editais);

  const [isFetchingProjetos, setIsFetchingProjetos] = useState(false);
  const [isFetchingEditais, setIsFetchingEditais] = useState(false);

  const filterRef = useRef(null);

  useEffect(() => {
    if (user.cpf) {
      setIsFetchingProjetos(true);
      axios
        .get(`/projeto?cpfUsuario=${user.cpf}`)
        .then((response) => {
          setProjetos(response.data.results);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setIsFetchingProjetos(false));
    }
  }, [user.cpf]);

  useEffect(() => {
    let editaisProjetos = [];
    let editaisFiltrado = [];
    if (projetos.length) {
      setIsFetchingEditais(true);

      axios
        .get("/edital")
        .then((response) => {
          // Separa os idEdital dos projetos
          projetos.forEach((value) => {
            editaisProjetos.push(value.idEdital);
          });

          // Coloca em uma lista apenas os editais que fazem parte dos projetos do usuario
          response.data.results.forEach((value) => {
            if (editaisProjetos.includes(value.id)) {
              editaisFiltrado.push(value);
            }
          });
          setEditais(editaisFiltrado);
          setSearchResults(editaisFiltrado);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setIsFetchingEditais(false));
    }
  }, [projetos]);

  function handleFilterChange(inputValue) {
    //filtrar por edital ou projeto

    setSearchResults(
      editais.filter(
        (edital) =>
          edital.nome.toLowerCase().includes(inputValue.toLowerCase()) ||
          projetos.filter(
            (projeto) =>
              projeto.idEdital === edital.id &&
              projeto.nome.toLowerCase().includes(inputValue.toLowerCase())
          ).length > 0
      )
    );
  }

  useEffect(() => {
    //sempre manter os search results atualizados quando um edital for apagado
    setSearchResults(
      editais.filter(
        (edital) =>
          edital.nome
            .toLowerCase()
            .includes(filterRef.current.value.toLowerCase()) ||
          projetos.filter(
            (projeto) =>
              projeto.idEdital === edital.id &&
              projeto.nome
                .toLowerCase()
                .includes(filterRef.current.value.toLowerCase())
          ).length > 0
      )
    );
  }, [editais, projetos]);

  const isFetching = isFetchingEditais || isFetchingProjetos;

  return (
    <>
      <h1 className={style.h1}>Meus projetos</h1>
      <div className={style.container}>
        <div className={style.filtrarContainer}>
          <input
            type="text"
            placeholder="Filtrar por editais ou projetos"
            className={style.filtrar}
            onChange={(e) => handleFilterChange(e.target.value)}
            ref={filterRef}
          />
        </div>
      </div>
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <div className={style.container}>
            {editais.length ? (
              <h3>
                Para prestar contas de um projeto, escolha o edital ao qual ele
                pertence:
              </h3>
            ) : (
              <h3>
                {/* caso nenhum projeto exista na conta da pessoa */}
                Sua conta ainda não possui projetos registrados. Caso ache que
                isso é um erro, contate o DPPI para adicioná-los.
              </h3>
            )}
          </div>
          <div className={"users"}>
            {searchResults.map((edital) => {
              return (
                <EditalUsuario
                  key={edital.id}
                  editalInfo={edital}
                  todosProjetos={projetos}
                  setTodosProjetos={setProjetos}
                  todosEditais={editais}
                  setTodosEditais={setEditais}
                />
              );
            })}
            {/* mostrar mensagem quando nenhum resultado for encontrado */}
            {searchResults.length === 0 && editais.length !== 0 && (
              <div className={style.container}>
                <h3>Nada encontrado com este filtro</h3>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
