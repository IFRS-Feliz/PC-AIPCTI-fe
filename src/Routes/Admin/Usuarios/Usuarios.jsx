import { useEffect, useState } from "react";
import axios from "../../../axios";

import User from "../../../Components/User";
import { useHistory } from "react-router";

import style from "../../../assets/css/routes/usuarios.module.css";

export default function Admin() {
  const history = useHistory();

  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

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
          />

          <button
            onClick={() => history.push("/admin/usuarios/adicionar")}
            className={style.addAdmin}
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

      <div className="users">
        {searchResults.map((user) => {
          return <User key={user.cpf} userInfo={user} editais={editais} />;
        })}
      </div>
    </>
  );
}
