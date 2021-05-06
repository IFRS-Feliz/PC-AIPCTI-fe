import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([{}]);

  useEffect(() => {
    axios.get(`/projeto/${id}`).then((response) => {
      setProjeto(response.data.results[0]);
    });
  }, [id]);

  return (
    <>
      <h1 className={style.tituloRelatorio}>
        Relatório <br /> Projeto - {projeto.nome}
      </h1>
      {itens.map((item, index) => (
        <Item itemInfo={item} key={index} />
      ))}

      <button
        className={style.buttonAdicionar}
        onClick={() => setItens([...itens, {}])}
      >
        Adicionar
      </button>
    </>
  );
}
