import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";

import Projeto from "../../../Components/Projeto";

import style from "../../../assets/css/routes/usuarios.module.css";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Projetos() {
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [searchResults, setSearchResults] = useState(projetos);

  const filterRef = useRef(null);

  useEffect(() => {
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

  return (
    <>
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

          <Link to={"/admin/projetos/adicionar"} className={style.addAdmin}>
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
