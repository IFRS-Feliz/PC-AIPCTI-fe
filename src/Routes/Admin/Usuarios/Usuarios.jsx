import { useEffect, useRef, useState } from "react";
import axios from "../../../axios";

import User from "../../../Components/Admin/User";
import { Link } from "react-router-dom";

import style from "../../../assets/css/routes/usuarios.module.css";
import Paginacao, { SortOptions } from "../../../Components/Paginacao";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, SetNextPage] = useState({});

  const filterRef = useRef(null);

  const [sortBy, setSortBy] = useState("nome"); //nome | cpf
  const [order, setOrder] = useState("ASC"); //ASC | DESC
  useEffect(() => {
    axios
      .get(
        `/usuario?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&order=${order}`
      )
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.results);
        SetNextPage(response.data.next);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage, sortBy, order]); //requisitar ao mudar de pagina e ao apagar users

  useEffect(() => {
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
    setSearchResults(users);
    filterRef.current.value = "";
  }, [users]);

  let typingTimer;
  function handleFilterChange(e) {
    function finishedTyping() {
      axios
        .get(`/search/usuario?q=${e.target.value}`)
        .then((response) => {
          setSearchResults(response.data.results);
        })
        .catch((e) => console.log(e));
    }

    clearTimeout(typingTimer);
    if (e.target.value) {
      typingTimer = setTimeout(finishedTyping, 1000);
    } else setSearchResults(users);
  }

  return (
    <>
      <h1 className={style.h1}>Usuários</h1>
      <div className={style.container}>
        <div className={style.filtrarContainer}>
          <input
            onChange={handleFilterChange}
            type="text"
            placeholder="Filtrar por nome ou CPF"
            className={style.filtrar}
            ref={filterRef}
          />

          <Link to={"/admin/usuarios/adicionar"} className={style.addAdmin}>
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
          options={["nome"]}
        />
      </div>

      <div className="users">
        {searchResults.map((user) => {
          return (
            <User
              key={user.cpf}
              userInfo={user}
              editais={editais}
              users={users}
              setUsers={setUsers}
            />
          );
        })}
      </div>

      {/* paginacao */}
      {users === searchResults && ( //somente mostrar paginacao quando nao filtrando
        <Paginacao
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          nextPage={nextPage}
        />
      )}
    </>
  );
}
