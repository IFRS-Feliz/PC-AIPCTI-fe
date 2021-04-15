import { useContext } from "react";
import { Link } from "react-router-dom";
import style from "../assets/css/components/header.module.css";
import logo from "../assets/img/if.png";
import AuthContext from "../Contexts/Auth";

export default function Header() {
  const { Logout, user } = useContext(AuthContext);

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
            <li>{user && <button onClick={Logout}>Logout</button>}</li>
          </ul>
        </nav>
      </header>
      <hr className={style.verdeForte}></hr>
    </>
  );
}
