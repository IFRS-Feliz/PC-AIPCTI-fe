import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import style from "../assets/css/components/header.module.css";
import logo from "../assets/img/if.png";

export default function Header() {
  const history = useHistory();

  return (
    <>
      <header className={style.containerHeader}>
        <nav className={(style.row, style.navHeader)}>
          <Link to="/" className={style.link}>
            <img className={style.imagemLogo} src={logo} alt="logo ifrs" />
          </Link>
          <h1 className={style.titulo}>
            Geração de relatório de prestações de contas
          </h1>
          <ul className={(style.row, style.ulHeader)}>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  axios
                    .get("http://localhost:5000/auth/logout")
                    .then((response) => console.log(response, "Deslogado"));
                  history.push("/login");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <hr className={style.verdeForte}></hr>
    </>
  );
}
