import { useEffect, useState } from "react";
import axios from "../axios";

import User from "../Components/User";
import { useHistory } from "react-router";

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
      <h1>Usuários</h1>
      <button onClick={() => history.push("/admin/adicionar")}>+</button>
      <p>Filtrar</p>

      <div className="users">
        {users.map((user) => {
          return <User key={user.cpf} userInfo={user} editais={editais} />;
        })}
      </div>
    </>
  );
}
