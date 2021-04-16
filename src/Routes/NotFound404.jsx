import { Link } from "react-router-dom";

import style from "../assets/css/routes/notfound404.module.css";

export default function NotFound404() {
  return (
    <div className={style.container}>
      <p>404 - página não encontrada</p>
      <h1>Está perdido?</h1>
      <Link to="/">Voltar ao início</Link>
    </div>
  );
}
