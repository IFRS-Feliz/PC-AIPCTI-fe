import { useEffect, useState } from "react";
import axios from "../../../axios";

import User from "../../../Components/User";
import { useHistory } from "react-router";

import style from "../../../assets/css/routes/usuarios.module.css";

export default function Admin() {
  const history = useHistory();

  const [users, setUsers] = useState([]);
  const [editais, setEditais] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/usuario")
      .then((response) => {
        console.log(response.data.results);
        setUsers(response.data.results);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          history.replace("/projetos");
        } else if (e.response.status === 401) {
          history.replace("/login");
        }
      });
    axios
      .get("http://localhost:5000/edital")
      .then((response) => {
        console.log(response.data.results);
        setEditais(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [history]); //history nas dependencias para tirar warning

  return (
    <>
      <h1 className={style.h1}>Usuários</h1>
      <div className={style.container}>
        <input type="text" placeholder="Filtrar" className={style.filtrar} />

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

      <div className="users">
        {users.map((user) => {
          return <User key={user.cpf} userInfo={user} editais={editais} />;
        })}
      </div>
    </>
  );
}
