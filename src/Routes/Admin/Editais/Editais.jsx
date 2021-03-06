import axios from "../../../axios";
import { useEffect } from "react";
import { useState } from "react";

import Edital from "../../../Components/Admin/Edital";

import style from "../../../assets/css/routes/usuarios.module.css";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Paginacao, { SortOptions } from "../../../Components/Paginacao";

export default function Editais() {
  const [editais, setEditais] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchResults, setSearchResults] = useState(editais);
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, SetNextPage] = useState({});

  const filterRef = useRef(null);

  const [sortBy, setSortBy] = useState("nome"); //id | nome | dataInicio
  const [order, setOrder] = useState("ASC"); //ASC | DESC
  useEffect(() => {
    axios
      .get(
        `/edital?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        setEditais(response.data.results);
        SetNextPage(response.data.next);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get("/usuario")
      .then((response) => {
        setUsers(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage, sortBy, order]);

  useEffect(() => {
    //manter search results sempre em sync
    setSearchResults(editais);
    filterRef.current.value = "";
  }, [editais]);

  let typingTimer;
  function handleFilterChange(e) {
    function finishedTyping() {
      axios
        .get(`/search/edital?q=${e.target.value}`)
        .then((response) => {
          setSearchResults(response.data.results);
        })
        .catch((e) => console.log(e));
    }

    clearTimeout(typingTimer);
    if (e.target.value) {
      typingTimer = setTimeout(finishedTyping, 1000);
    } else setSearchResults(editais);
  }

  return (
    <>
      <h1 className={style.h1}>Editais</h1>
      <div className={style.container}>
        <div className={style.filtrarContainer}>
          <input
            type="text"
            placeholder="Filtrar por nome ou ano"
            className={style.filtrar}
            onChange={(e) => handleFilterChange(e)}
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
      <div
        style={{ margin: "auto", display: "flex", justifyContent: "center" }}
      >
        <SortOptions
          setSortBy={setSortBy}
          setOrder={setOrder}
          sortBy={sortBy}
          order={order}
          options={["id", "nome", "dataInicio"]}
        />
      </div>
      <div className={"users"}>
        {searchResults.map((edital) => {
          return (
            <Edital
              key={edital.id}
              editalInfo={edital}
              todosEditais={editais}
              setTodosEditais={setEditais}
              users={users}
            />
          );
        })}
      </div>

      {/* paginacao */}
      {searchResults === editais && (
        //somente mostrar paginacao quando nao filtrando
        <Paginacao
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          nextPage={nextPage}
        />
      )}
    </>
  );
}
