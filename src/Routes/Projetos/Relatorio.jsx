import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";
import Loading from "../../Components/Loading";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([]);

  const [isPostingItem, setIsPostingItem] = useState(false);

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
        // ordenar de acordo por a coluna position
        response.data.results.sort((a, b) => {
          if (a.posicao > b.posicao) return 1;
          else if (a.posicao < b.posicao) return -1;
          else return 0;
        });
        setItens(response.data.results);
      })
      .catch((e) => console.log(e));
  }, [id]);

  function valorTotalItens(despesa) {
    let valorTotalDespesa = 0;
    let soma = 0;
    let resto;

    if (despesa === "custeio") {
      valorTotalDespesa = Number(projeto.valorRecebidoCusteio);
    } else {
      valorTotalDespesa = Number(projeto.valorRecebidoCapital);
    }

    itens.forEach((value) => {
      if (value.despesa === despesa) {
        soma += Number(value.valorTotal);
      }
    });

    resto = Number(valorTotalDespesa) - Number(soma);

    return {
      valorTotalDespesa,
      soma,
      resto,
    };
  }

  function valorTotal() {
    let soma = 0;
    itens.forEach((value) => {
      soma += Number(value.valorTotal);
    });

    return soma;
  }

  return (
    <>
      <div className={style.tituloRelatorio}>
        <h1>Prestação de contas - {projeto.nome}</h1>
      </div>

      <div className={style.section}>
        <div className={style.sectionHeader}>
          <div>
            <h1>Despesas</h1>

            <h3>Cadastre itens e serviços comprados abaixo: </h3>
            <p>
              *devem ser ordenados conforme o plano de aplicação de recursos
            </p>
          </div>
        </div>
        <DragDropContext
          onDragEnd={(result) => {
            //caso tenha sido droppado fora da area droppable
            if (!result.source || !result.destination) return;
            //caso tenha sido droppado no mesmo lugar onde ja estava
            if (result.source.index === result.destination.index) return;

            //criar lista com itens reordanados
            const itensCopy = JSON.parse(JSON.stringify(itens));
            const [deleted] = itensCopy.splice(result.source.index, 1);
            itensCopy.splice(result.destination.index, 0, deleted);

            //atualizar posicoes no banco
            let itensToSend = [];
            itensCopy.forEach((itemCopy, index) => {
              itemCopy.posicao = index;
              itensToSend.push({ posicao: itemCopy.posicao, id: itemCopy.id });
            });

            axios
              .put("/item?posicoes=true", { itens: itensToSend })
              .then(() => {
                setItens(itensCopy);
              })
              .catch(() => {
                alert("Não foi possível alterar a ordem dos itens");
              });
          }}
        >
          <Droppable droppableId="itens">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {itens.map((item, index) => (
                  <Draggable
                    draggableId={String(item.id)}
                    key={item.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Item
                          itens={itens}
                          index={index}
                          setItens={setItens}
                          dragHandleInnerProps={{ ...provided.dragHandleProps }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                <div style={{ position: "relative" }}>
                  {isPostingItem && <Loading />}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={() => {
            setIsPostingItem(true);
            axios
              .post(`/item`, {
                itens: [
                  {
                    idProjeto: id,
                    descricao: "",
                    tipo: "materialConsumo",
                    despesa: "capital",

                    nomeMaterialServico: "",
                    marca: "",
                    modelo: "",

                    quantidade: 0,
                    valorUnitario: 0,
                    valorTotal: 0,
                    frete: 0,
                    tipoDocumentoFiscal: "nfe",
                    isCompradoComCpfCoordenador: false,
                    isNaturezaSingular: false,
                    posicao: itens.length,

                    anexo: "",
                  },
                ],
              })
              .then((response) => {
                setItens([
                  ...itens,
                  {
                    ...response.data.results[0],
                    dataCompraContratacao: "",
                    cnpjFavorecido: "",
                    numeroDocumentoFiscal: "",
                  },
                ]);
              })
              .catch(() => {
                alert("Não foi possível criar o novo item.");
              })
              .finally(() => setIsPostingItem(false));
          }}
          className={style.buttonAdicionar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#ffffff"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Adicionar uma despesa
        </button>
      </div>

      <div className={style.section}>
        <div className={style.sectionHeader}>
          <div>
            <h1>GRU - Guia de Recolhimento da União</h1>
          </div>
        </div>
      </div>

      <div className={style.section}>
        <div className={style.sectionHeader}>
          <div>
            <h1>Resumo</h1>
            <div className={style.gridResumo}>
              <div className={style.resumoCusteio}>
                <p className={style.tituloResumo}>Custos custeio</p>
                <div className={style.informacoesResumo}>
                  <p>
                    <strong>Valor total:</strong>
                  </p>
                  <p>
                    R$ {valorTotalItens("custeio").valorTotalDespesa.toFixed(2)}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>R$ {valorTotalItens("custeio").soma.toFixed(2)}</p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>R$ {valorTotalItens("custeio").resto.toFixed(2)}</p>
                </div>
              </div>
              <div className={style.resumoCapital}>
                <p className={style.tituloResumo}>Custos capital</p>
                <div className={style.informacoesResumo}>
                  <p>
                    <strong>Valor total:</strong>
                  </p>
                  <p>
                    R$ {valorTotalItens("capital").valorTotalDespesa.toFixed(2)}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>R$ {valorTotalItens("capital").soma.toFixed(2)}</p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>R$ {valorTotalItens("capital").resto.toFixed(2)}</p>
                </div>
              </div>
              <div className={style.resumoTotal}>
                <p>Total gasto: R$ {valorTotal().toFixed(2)}</p>
                <p>
                  Total restante:{" R$ "}
                  {(
                    Number(projeto.valorRecebidoTotal) - Number(valorTotal())
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
