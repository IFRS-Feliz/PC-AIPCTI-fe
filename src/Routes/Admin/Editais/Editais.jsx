import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";

import Edital from "../../../Components/Edital";

import style from "../../../assets/css/routes/usuarios.module.css";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Editais() {
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [searchResults, setSearchResults] = useState(editais);

  const filterRef = useRef(null);

  useEffect(() => {
    axios
      .get("/edital")
      .then((response) => {
        setEditais(response.data.results);
        setSearchResults(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get("/projeto")
      .then((response) => {
        setProjetos(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleFilterChange(inputValue) {
    //filtrar por edital ou projeto

    setSearchResults(
      editais.filter(
        (edital) =>
          edital.nome.includes(inputValue) ||
          projetos.filter(
            (projeto) =>
              projeto.idEdital === edital.id &&
              projeto.nome.includes(inputValue)
          ).length > 0
      )
    );
  }

  useEffect(() => {
    //sempre manter os search results atualizados quando um edital for apagado
    setSearchResults(
      editais.filter(
        (edital) =>
          edital.nome.includes(filterRef.current.value) ||
          projetos.filter(
            (projeto) =>
              projeto.idEdital === edital.id &&
              projeto.nome.includes(filterRef.current.value)
          ).length > 0
      )
    );
  }, [editais, projetos]);

  return (
    <>
      <h1 className={style.h1}>Editais</h1>
      <div className={style.container}>
        <div className={style.filtrarContainer}>
          <input
            type="text"
            placeholder="Filtrar por algo"
            className={style.filtrar}
            onChange={(e) => handleFilterChange(e.target.value)}
            ref={filterRef}
          />

          <Link to={"/admin/editais/adicionar"} className={style.addAdmin}>
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
          </Link>
        </div>
      </div>

      <div className={"users"}>
        {searchResults.map((edital) => {
          return (
            <Edital
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
