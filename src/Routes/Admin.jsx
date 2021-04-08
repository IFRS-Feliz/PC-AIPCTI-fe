import { useEffect, useState } from "react";
import axios from "axios";

import User from "../Components/User";

axios.defaults.withCredentials = true;

export default function Admin() {
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
          window.location.href = "/projetos";
        } else if (e.response.status === 401) {
          window.location.href = "/login";
        }
      });
    axios.get("http://localhost:5000/edital").then((response) => {
      console.log(response.data.results);
      setEditais(response.data.results);
    });
  }, []);

  return (
    <>
      <h1>Usuários</h1>
      <a href="/admin/adicionar">
        <button>+</button>
      </a>
      <p>Filtrar</p>

      <div className="users">
        {users.map((user) => {
          return <User key={user.cpf} userInfo={user} editais={editais} />;
        })}
      </div>
    </>
  );
}
