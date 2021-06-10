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

  function handleAddItem() {
    setIsPostingItem(true);
    axios
      .post(`/item`, {
        itens: [{ idProjeto: id, posicao: itens.length }],
      })
      .then((response) => {
        setItens([...itens, response.data.results[0]]);
      })
      .catch(() => {
        alert("Não foi possível criar o novo item.");
      })
      .finally(() => setIsPostingItem(false));
  }

  return (
    <>
      <div className={style.tituloRelatorio}>
        <h1>Prestação de contas - {projeto.nome}</h1>
      </div>

      <div className={style.section}>
        <div className={style.sectionHeader}>
          <span>
            <h1>Despesas</h1>

            <h3>Cadastre itens e serviços comprados abaixo: </h3>
            <p>
              *devem ser ordenados conforme o plano de aplicação de recursos
            </p>
          </span>
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

        <button onClick={handleAddItem} className={style.buttonAdicionar}>
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
            <div className={style.mainContentGru}>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={style.divTop}>
                  <label htmlFor="valorGru">
                    <p>Valor devolvido:</p>
                  </label>
                  <input
                    type="number"
                    name="valorGru"
                    id="valorGru"
                    placeholder="Digite o valor aqui"
                  />
                </div>
                <div className={style.divBottom}>
                  <p>não anexado/visualizar</p>
                  <div style={{ display: "flex", height: "100%" }}>
                    <button>Desanexar</button>
                    <label htmlFor="anexarGru">
                      <p>Anexar GRU</p>
                    </label>
                    <input type="file" name="anexarGru" id="anexarGru" hidden />
                    <button>Download</button>
                  </div>
                </div>
              </form>
            </div>
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
                    {" "}
                    {valorTotalItens(
                      "custeio"
                    ).valorTotalDespesa.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>
                    {" "}
                    {valorTotalItens("custeio").soma.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>
                    {" "}
                    {valorTotalItens("custeio").resto.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
              <div className={style.resumoCapital}>
                <p className={style.tituloResumo}>Custos capital</p>
                <div className={style.informacoesResumo}>
                  <p>
                    <strong>Valor total:</strong>
                  </p>
                  <p>
                    {valorTotalItens(
                      "capital"
                    ).valorTotalDespesa.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>
                    {valorTotalItens("capital").soma.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>
                    {valorTotalItens("capital").resto.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
              <div className={style.resumoTotal}>
                <p>
                  Total gasto:{" "}
                  {valorTotal().toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  Total restante:{" "}
                  {(
                    Number(projeto.valorRecebidoTotal) - Number(valorTotal())
                  ).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <abbr title="Clique aqui para gerar o PDF do relatório">
        <div className={style.buttonCreatePDF}>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
            </svg>
          </button>
        </div>
      </abbr>
    </>
  );
}
