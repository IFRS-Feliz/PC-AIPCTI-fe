import { useEffect, useRef, useState } from "react";
import axios from "../../../axios";

import User from "../../../Components/User";
import { Link } from "react-router-dom";

import style from "../../../assets/css/routes/usuarios.module.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const filterRef = useRef(null);

  useEffect(() => {
    axios
      .get("/usuario")
      .then((response) => {
        setUsers(response.data.results);
        setSearchResults(response.data.results);
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
    setSearchResults(
      users.filter(
        (user) =>
          user.nome
            .toLowerCase()
            .includes(filterRef.current.value.toLocaleLowerCase()) ||
          String(user.cpf).includes(filterRef.current.value)
      )
    );
  }, [users]);

  function handleFilterChange(e) {
    //filtrar por nome ou cpf
    setSearchResults(
      users.filter(
        (user) =>
          user.nome
            .toLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          String(user.cpf).includes(e.target.value)
      )
    );
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

      <div className="users">
        {searchResults.map((user, i) => {
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
    </>
  );
}
