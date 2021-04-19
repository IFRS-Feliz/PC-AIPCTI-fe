import { useHistory } from "react-router";

import style from "../../assets/css/routes/admin.module.css";

export default function Admin() {
  const history = useHistory();
  return (
    <div>
      <h1 className={style.tituloAdmin}>Admin</h1>
      <div className={style.containerAdmin}>
        <div className={style.centralizar}>
          <button
            className={style.botaoAdmin}
            onClick={() => history.push("/admin/usuarios")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className={style.svgAdmin}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          <p className={style.pAdmin}>Usuários</p>
        </div>
        <div className={style.separador}></div>
        <div className={style.centralizar}>
          <button
            className={style.botaoAdmin}
            onClick={() => history.push("/admin/editais")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className={style.svgAdmin}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
            </svg>
          </button>
          <p className={style.pAdmin}>Editais</p>
        </div>
      </div>
    </div>
  );
}
