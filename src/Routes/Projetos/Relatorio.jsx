import axios from "../../axios";
import axiosDefault from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";
import Loading from "../../Components/Loading";
import Gru from "./Gru";

export default function Relatorio() {
  const { id } = useParams();
  const [edital, setEdital] = useState({});
  const [projeto, setProjeto] = useState({});
  const [itens, setItens] = useState([]);

  const [isPostingItem, setIsPostingItem] = useState(false);
  const [isReordenandoItens, setIsReordenandoItens] = useState(false);

  const [alertModalContent, setAlertModalContent] = useState({});

  function handleTogglingModal(itemIdx, { highlitedFieldName, index }, msg) {
    if (alertModalContent.itemIdx === itemIdx) setAlertModalContent({});
    else {
      setAlertModalContent({ itemIdx, highlitedFieldName, index, msg });
    }
  }

  const [relatorioUrl, setRelatorioUrl] = useState();
  const relatorioDownload = useRef();

  function handleRequestRelatorio() {
    axiosDefault
      .get(`${process.env.REACT_APP_API_URL}/projeto/${id}/relatorio`, {
        responseType: "arraybuffer",
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        const data = response.data;
        const blob = new Blob([data], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        setRelatorioUrl(url);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (relatorioUrl) relatorioDownload.current.click();
  }, [relatorioUrl]);

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
  useEffect(() => {
    if (projeto.idEdital) {
      axios
        .get(`/edital/${projeto.idEdital}`)
        .then((response) => {
          setEdital(response.data.results[0]);
        })
        .catch((e) => console.log(e));
    }
  }, [projeto]);

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

  function getDirtyItens() {
    const filtered = itens.filter(
      (item) => item.isDirty || (item.warnings && item.warnings[2])
    );
    return filtered;
  }
  const dirtyItens = getDirtyItens();

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

            setIsReordenandoItens(true);
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
              })
              .finally(() => setIsReordenandoItens(false));
          }}
        >
          <Droppable droppableId="itens">
            {(provided, _snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {isReordenandoItens && <Loading />}
                {itens.map((item, index) => (
                  <Draggable
                    draggableId={String(item.id)}
                    key={item.id}
                    index={index}
                  >
                    {(provided, _snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Item
                          itens={itens}
                          index={index}
                          setItens={setItens}
                          dragHandleInnerProps={{ ...provided.dragHandleProps }}
                          handleTogglingModal={handleTogglingModal}
                          dataLimiteEdital={edital.dataLimitePrestacao}
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
            valorRestanteCusteio={restoCusteio}
            valorRestanteCapital={restoCapital}
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
        {/* link invisivel clicado pelo ref após requisicao do relatorio */}
        <a
          download={"relatorio.zip"}
          disabled={!relatorioUrl}
          ref={relatorioDownload}
          href={relatorioUrl}
          hidden
        >
          {relatorioUrl ? "download relatorio" : "relatorio nao gerado"}
        </a>
        <div className={style.buttonCreatePDF}>
          <button onClick={handleRequestRelatorio}>
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

      {alertModalContent.itemIdx !== undefined && (
        <WarningsModal
          warnings={itens[alertModalContent.itemIdx].warnings}
          isDirty={itens[alertModalContent.itemIdx].isDirty}
          setAlertModalContent={setAlertModalContent}
          posicao={alertModalContent.itemIdx}
          name={
            itens[alertModalContent.itemIdx].nomeMaterialServico || "Novo item"
          }
          highlitedFieldName={alertModalContent.highlitedFieldName}
          highlitedFieldNameIndex={alertModalContent.index}
          msg={alertModalContent.msg}
        />
      )}
      {dirtyItens.length && (
        <div
          className={style.sectionHeader}
          style={itens.length === 0 ? { display: "none" } : {}}
        >
          <div className={style.contentFormWarning}>
            <h3>Verifique os seguintes itens:</h3>

            <span>
              {dirtyItens.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleTogglingModal(item.posicao, {})}
                >
                  <p>
                    {item.posicao + 1} -{" "}
                    {item.nomeMaterialServico || "Novo item"}
                  </p>
                </div>
              ))}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function WarningsModal({
  warnings,
  isDirty,
  setAlertModalContent,
  posicao,
  name,
  highlitedFieldName,
  highlitedFieldNameIndex,
  msg,
}) {
  const informacoes = warnings ? warnings[0] : null;
  const orcamentos = warnings ? warnings[1] : null;

  const scrollToHighlitedField = useRef();

  const informacoesContent = informacoes
    ? Object.keys(informacoes).reduce((result, propriedade) => {
        const warning = informacoes[propriedade];
        let name = getName(propriedade);
        if (warning) {
          if (
            propriedade === highlitedFieldName &&
            (highlitedFieldNameIndex === undefined ||
              highlitedFieldNameIndex === null)
          ) {
            result.unshift(
              <li
                key={propriedade}
                style={{
                  marginLeft: "2.5rem",
                  padding: "0.4rem 0",
                }}
              >
                <p>
                  <span
                    style={{ color: "red", fontWeight: "bold" }}
                  >{`- ${name}: `}</span>
                  {`${warning}`}
                </p>
              </li>
            );
            return result;
          }
          result.push(
            <li
              key={propriedade}
              style={{ marginLeft: "2.5rem", padding: "0.4rem 0" }}
            >
              <p>- {`${name}: ${warning}`}</p>
            </li>
          );
        }
        return result;
      }, [])
    : [];
  const orcamentoContent = orcamentos
    ? orcamentos.reduce((result, orcamento, i) => {
        let content = [];
        Object.keys(orcamento).forEach((propriedade) => {
          const warning = orcamento[propriedade];
          let name = getName(propriedade);
          if (warning) {
            if (
              propriedade === highlitedFieldName &&
              highlitedFieldNameIndex === i
            ) {
              content.unshift(
                <li
                  key={propriedade}
                  style={{ marginLeft: "2.5rem", padding: "0.4rem 0" }}
                >
                  <p>
                    <span
                      style={{ color: "red", fontWeight: "bold" }}
                    >{`- ${name}: `}</span>
                    {`${warning}`}
                  </p>
                </li>
              );
              return;
            }
            content.push(
              <li
                key={propriedade}
                style={{ marginLeft: "2.5rem", padding: "0.4rem 0" }}
              >
                <p>- {`${name}: ${warning}`}</p>
              </li>
            );
          }
        });

        if (content.length > 0) {
          result.push(
            <div key={i} style={{ margin: "1rem 0" }}>
              <h3 id={`warningsModalPosition${i}`}>Orcamento {i + 1}: </h3>{" "}
              {content}
            </div>
          );
        }
        return result;
      }, [])
    : [];

  useEffect(() => {
    if (
      highlitedFieldNameIndex !== undefined &&
      highlitedFieldNameIndex !== null
    ) {
      scrollToHighlitedField.current.click();
    }
  }, [highlitedFieldNameIndex]);

  const history = useHistory();

  function closeModal() {
    //fazer o modal desaparecer
    setAlertModalContent({});
    //remover # do url caso tenha scrollado para um orcamento
    history.push(history.location.pathname.split("#")[0]);
  }

  return (
    <div
      onClick={closeModal}
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
        <a
          href={`#warningsModalPosition${highlitedFieldNameIndex}`}
          ref={scrollToHighlitedField}
          hidden
        >
          Scroll
        </a>
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
          {msg && (
            <p
              style={{
                textAlign: "center",
                margin: "1rem 0",
                color: "red",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {msg}
            </p>
          )}
          {informacoesContent.length ? (
            <div style={{ margin: "1rem 2rem" }}>
              <h3>Informações:</h3>
              {informacoesContent}
            </div>
          ) : (
            ""
          )}
        </div>
        <div style={{ margin: "1rem 2rem" }}>
          {orcamentoContent.length ? orcamentoContent : ""}
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
    case "isOrcamentoCompra":
      return "Orçamento referente à compra";
    case "pathAnexo":
      return "Anexo do documento";
    case "justificativa":
      return "Justificativa";
    case "quantidadeOrcamentos":
      return "Quantidade de orçamentos";
    case "isCompradoComCpfCoordenador":
      return "CPF do coordenador";
    case "isOrcadoComCpfCoordenador":
      return "CPF do coordenador";

    default:
      return propriedade;
  }
}
