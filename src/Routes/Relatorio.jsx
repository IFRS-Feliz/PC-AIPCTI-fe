import axios from "../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NotaFiscal from "../Components/NotaFiscal";

import style from "../assets/css/routes/relatorio.module.css";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);

  useEffect(() => {
    axios.get(`/projeto?id=${id}`).then((response) => {
      setProjeto(response.data.results);
    });
  }, [id]);

  return (
    <>
      <h1 className={style.tituloRelatorio}>Gerar relatório</h1>

      <NotaFiscal />
    </>
  );
}
