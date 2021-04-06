import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies();

  function handleLogin() {
    axios
      .post("http://localhost:5000/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
        setCookie("email", response.data[0].email, {
          maxAge: 60 * 60 * 24 * 365,
        });
        setCookie("isAdmin", response.data[0].isAdmin, {
          maxAge: 60 * 60 * 24 * 365,
        });
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div>Header</div>

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
