import axios from "axios";
import { useState } from "react";

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    axios
      .post("http://localhost:5000/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.isAdmin === 1) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/projetos";
        }
      })
      .catch((err) => {
        //mostrar credenciais erradas
      });
  }

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
          <button onClick={handleLogin}>Login</button>
        </form>
      </div>
    </>
  );
}
