import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    axios
      .get(`/projeto/${id}`)
      .then((response) => {
        setProjeto(response.data.results[0]);
      })
      .catch((e) => console.log(e));
    axios
      .get(`/item?idProjeto=${id}`)
      .then((response) => {
        setItens(response.data.results);
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <>
      <h1 className={style.tituloRelatorio}>
        Relatório <br /> Projeto - {projeto.nome}
      </h1>
      {itens.map((item, index) => (
        <Item
          itemInfo={item}
          key={index}
          itens={itens}
          setItens={setItens}
          index={index}
        />
      ))}

      <button
        onClick={() =>
          setItens([
            ...itens,
            {
              descricao: "",
              tipo: "material de consumo",

              nomeMaterialServico: "",
              marca: "",
              modelo: "",

              dataCompraContratacao: "",
              cnpjFavorecido: "",
              quantidade: 0,
              valorUnitario: 0,
              valorTotal: 0,
              frete: 0,
              numeroDocumentoFiscal: "",
            },
          ])
        }
        className={style.buttonAdicionar}
      >
        Adicionar
      </button>
    </>
  );
}
