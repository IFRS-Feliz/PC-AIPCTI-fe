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
        // console.log(response.data.results);
        setItens(response.data.results);
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <>
      <div className={style.tituloRelatorio}>
        <h1>Prestação de contas - {projeto.nome}</h1>
        <h3>Cadastre os itens referentes ao projeto abaixo:</h3>
      </div>
      {itens.map((item, index) => (
        <Item key={index} itens={itens} index={index} setItens={setItens} />
      ))}

      <button
        onClick={() =>
          setItens([
            ...itens,
            {
              idProjeto: id,
              descricao: "",
              tipo: "materialConsumo",
              despesa: "capital",

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
              tipoDocumentoFiscal: "nfe",
              isCompradoComCpfCoordenador: false,
              isNaturezaSingular: false,

              anexo: "",
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
