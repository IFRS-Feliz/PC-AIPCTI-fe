import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([
    {
      descricao: "",
      tipo: "",

      nome: "",
      marca: "",
      modelo: "",

      data: "",
      favorecido: "",
      quantidade: 0,
      valorUnitario: 0,
      valorTotal: 0,
      frete: 0,
      numeroDocumentoFiscal: "",
    },
  ]);

  useEffect(() => {
    axios
      .get(`/projeto/${id}`)
      .then((response) => {
        setProjeto(response.data.results[0]);
      })
      .catch((e) => console.log(e));
    // axios
    //   .get(`/projeto/${id}/item`)
    //   .then((response) => {
    //     setItens(response.data.results);
    //   })
    //   .catch((e) => console.log(e));
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
