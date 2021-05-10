import axios from "../../axios";
import { useEffect, useContext } from "react";
import { useState } from "react";

import EditalUsuario from "../../Components/Usuario/EditalUsuario";

import style from "../../assets/css/routes/usuarios.module.css";
import { useRef } from "react";

import AuthContext from "../../Contexts/Auth";

export default function Projetos() {
  const { user } = useContext(AuthContext);
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [searchResults, setSearchResults] = useState(editais);

  const filterRef = useRef(null);

  useEffect(() => {
    user.cpf &&
      axios
        .get(`/projeto?cpfUsuario=${user.cpf}`)
        .then((response) => {
          setProjetos(response.data.results);
        })
        .catch((e) => {
          console.log(e);
        });
  }, [user.cpf]);

  useEffect(() => {
    let editaisProjetos = [];
    let editaisFiltrado = [];
    projetos.length &&
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
        });
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
      </div>
    </>
  );
}
