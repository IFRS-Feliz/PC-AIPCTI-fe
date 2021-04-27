import { Link } from "react-router-dom";
import style from "../assets/css/components/header.module.css";
import logo from "../assets/img/if.png";

export default function Header() {
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
        </nav>
      </header>
      <hr className={style.verdeForte}></hr>
    </>
  );
}
