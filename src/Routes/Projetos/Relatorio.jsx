import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";
import Loading from "../../Components/Loading";
import Gru from "./Gru";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([]);

  const [isPostingItem, setIsPostingItem] = useState(false);

  const [alertModalContent, setAlertModalContent] = useState(null);
  function handleTogglingModal(itemIdx) {
    if (alertModalContent === itemIdx) setAlertModalContent(null);
    else setAlertModalContent(itemIdx);
  }

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

  const [totalDevolvidoGru, setTotalDevolvidoGru] = useState(0);

  function valorTotalItens() {
    let somaCusteio = 0;
    let somaCapital = 0;

    let valorTotalCusteio = Number(projeto.valorRecebidoCusteio);
    let valorTotalCapital = Number(projeto.valorRecebidoCapital);

    itens.forEach((item) => {
      if (item.despesa === "custeio") {
        somaCusteio += Number(item.valorTotal);
      } else {
        somaCapital += Number(item.valorTotal);
      }
    });

    let restoCusteio = Number(valorTotalCusteio) - Number(somaCusteio);

    let restoCapital = Number(valorTotalCapital) - Number(somaCapital);

    return {
      valorTotalCusteio,
      valorTotalCapital,
      somaCusteio,
      somaCapital,
      restoCusteio,
      restoCapital,
    };
  }

  const {
    valorTotalCusteio,
    valorTotalCapital,
    somaCusteio,
    somaCapital,
    restoCusteio,
    restoCapital,
  } = valorTotalItens();

  function dirtyItens() {
    function hasWarnings(warnings) {
      if (!warnings || warnings.length !== 2) return false;
      if (Object.keys(warnings[0]).length > 0) return true;
      for (const warningOrcameto of warnings[1]) {
        if (warningOrcameto && Object.keys(warningOrcameto).length > 0)
          return true;
      }
      return false;
    }
    const filtered = itens.filter(
      (item) => item.isDirty || hasWarnings(item.warnings)
    );
    return filtered;
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
                          handleTogglingModal={handleTogglingModal}
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

      <div
        className={style.section}
        style={itens.length === 0 ? { display: "none" } : {}}
      >
        <div className={style.sectionHeader}>
          <Gru
            idProjeto={id}
            valorRestante={restoCusteio + restoCapital}
            setTotalDevolvido={setTotalDevolvidoGru}
          />
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
                    <strong>Valor recebido:</strong>
                  </p>
                  <p>
                    {valorTotalCusteio.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>
                    {somaCusteio.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>
                    {restoCusteio.toLocaleString("pt-br", {
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
                    <strong>Valor recebido:</strong>
                  </p>
                  <p>
                    {valorTotalCapital.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor gasto:</strong>
                  </p>
                  <p>
                    {somaCapital.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <strong>Valor restante:</strong>
                  </p>
                  <p>
                    {restoCapital.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
              <div className={style.resumoTotal}>
                <p>
                  Total gasto:{" "}
                  {(somaCapital + somaCusteio).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  Total restante:{" "}
                  {(restoCapital + restoCusteio).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  | Total devolvido (GRU):{" "}
                  {totalDevolvidoGru.toLocaleString("pt-br", {
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

      {alertModalContent !== null && (
        <WarningsModal
          warnings={itens[alertModalContent].warnings}
          isDirty={itens[alertModalContent].isDirty}
          setAlertModalContent={setAlertModalContent}
          posicao={alertModalContent}
          name={itens[alertModalContent].nomeMaterialServico || "Novo item"}
        />
      )}
      <div
        className={style.sectionHeader}
        style={itens.length === 0 ? { display: "none" } : {}}
      >
        <div className={style.contentFormWarning}>
          <h3>Verifique os seguintes itens:</h3>

          <span>
            {dirtyItens().map((item) => (
              <div
                key={item.id}
                onClick={() => handleTogglingModal(item.posicao)}
              >
                <p>
                  {item.posicao + 1} - {item.nomeMaterialServico || "Novo item"}
                </p>
              </div>
            ))}
          </span>
        </div>
      </div>
    </>
  );
}

function WarningsModal({
  warnings,
  isDirty,
  setAlertModalContent,
  posicao,
  name,
}) {
  const informacoes = warnings ? warnings[0] : null;
  const orcamentos = warnings ? warnings[1] : null;

  const informacoesContent = informacoes
    ? Object.keys(informacoes).map((propriedade) => {
        const warning = informacoes[propriedade];
        let name = getName(propriedade);
        if (warning) {
          return (
            <li key={propriedade} style={{ marginLeft: "2.5rem" }}>
              <p>- {`${name}: ${warning}`}</p>
            </li>
          );
        }
        return "";
      })
    : [];
  const orcamentoContent = orcamentos
    ? orcamentos.map((orcamento, i) => {
        let content = [];
        Object.keys(orcamento).forEach((propriedade) => {
          const warning = orcamento[propriedade];
          let name = getName(propriedade);
          if (warning) {
            content.push(
              <li key={propriedade} style={{ marginLeft: "2.5rem" }}>
                <p>- {`${name}: ${warning}`}</p>
              </li>
            );
          }
        });

        if (content.length > 0) {
          return (
            <div key={i} style={{ margin: "1rem 0" }}>
              <h3>Orcamento {i + 1}: </h3> {content}
            </div>
          );
        }
        return "";
      })
    : [];

  return (
    <div
      onClick={() => setAlertModalContent(null)}
      style={{
        position: "fixed",
        top: "0",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} className={style.modalWarning}>
        <div className={style.tituloModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 0 24 24"
            width="36px"
            fill="#000000"
          >
            <path
              d="M4.47 19h15.06L12 5.99 4.47 19zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"
              opacity="1"
              fill="yellow"
            />
            <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47zM11 16h2v2h-2zm0-6h2v4h-2z" />
          </svg>
          <div>
            <h2>{`Item ${posicao + 1} - ${name}`}</h2>
            {isDirty && (
              <div>Existem mudanças pendendes - salve para resolver</div>
            )}
          </div>
        </div>
        <div>
          {informacoesContent.filter((info) => info !== "").length ? (
            <div style={{ margin: "1rem 2rem" }}>
              <h3>Informações:</h3>
              {informacoesContent}
            </div>
          ) : (
            ""
          )}
        </div>
        <div style={{ margin: "1rem 2rem" }}>
          {orcamentoContent.filter((orcamento) => orcamento !== "").length
            ? orcamentoContent
            : ""}
        </div>
      </div>
    </div>
  );
}

function getName(propriedade) {
  switch (propriedade) {
    case "descricao":
      return "Descrição";
    case "tipo":
      return "Tipo";
    case "nomeMaterialServico":
      return "Nome do material / serviço";
    case "marca":
      return "Marca";
    case "modelo":
      return "Modelo";
    case "tipoDocumentoFiscal":
      return "Tipo do documento fiscal";
    case "dataCompraContratacao":
      return "Data da compra";
    case "cnpjFavorecido":
      return "Favorecido (CNPJ)";
    case "quantidade":
      return "Quantidade";
    case "valorUnitario":
      return "Valor unitário";
    case "frete":
      return "Valor do frete";
    case "valorTotal":
      return "Valor total";
    case "numeroDocumentoFiscal":
      return "N° do documento fiscal";
    case "dataOrcamento":
      return "Data do orçamento";

    default:
      return propriedade;
  }
}
