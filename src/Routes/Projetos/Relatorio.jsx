import axios, { fileBufferAxios } from "../../axios";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";
import Loading from "../../Components/Loading";
import Gru from "./Gru";
import NotFound404 from "../NotFound404";

export default function Relatorio() {
  const { id } = useParams();
  const [edital, setEdital] = useState({});
  const [projeto, setProjeto] = useState({});
  const [itens, setItens] = useState([]);

  //estados para decidir se deve mostrar loading ao executar certas tarefas
  const [isPostingItem, setIsPostingItem] = useState(false);
  const [isReordenandoItens, setIsReordenandoItens] = useState(false);

  //estado para decidir se deve ou nao renderizar o modal de warnings
  //e sobre o que serao os warnings mostrados
  const [alertModalContent, setAlertModalContent] = useState({});
  //deve ser estruturado assim: { itemIdx, highlitedFieldName, index, msg }
  //index caso seja um orcamento

  //mostrar e parar de mostrar o modal, setando o seu conteudo
  function handleTogglingModal(itemIdx, { highlitedFieldName, index }, msg) {
    if (alertModalContent.itemIdx === itemIdx) setAlertModalContent({});
    else {
      setAlertModalContent({ itemIdx, highlitedFieldName, index, msg });
    }
  }

  //funcao para criar um novo item/despesa
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

  //URL do blob do relatorio baixado
  const [relatorioUrl, setRelatorioUrl] = useState();
  //ref para o anchor usado para fazer o trigger do download do relatorio
  const relatorioDownload = useRef();

  //estados relativos ao download do relatorio
  const [isDownloadingRelatorio, setIsDownloadingRelatorio] = useState(false);
  const [showDownloadingRelatorioModal, setShowDownloadingRelatorioModal] =
    useState(false);

  //funcao para requisitar a geracao do relatorio e criar o url para seu blob
  function handleRequestRelatorio() {
    setIsDownloadingRelatorio(true);
    setShowDownloadingRelatorioModal(true);
    fileBufferAxios
      .get(`/projeto/${id}/relatorio`)
      .then((response) => {
        const mime = response.headers["content-type"];
        const data = response.data;
        const blob = new Blob([data], {
          type: mime,
        });
        const url = URL.createObjectURL(blob);
        setRelatorioUrl(url);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setIsDownloadingRelatorio(false));
  }

  //baixar o relatorio automaticamente assim que o url for setado pela funcao acima
  //utilizando o ref do anchor
  useEffect(() => {
    if (relatorioUrl) relatorioDownload.current.click();
  }, [relatorioUrl]);

  const [isFetchingProjeto, setIsFetchingProjeto] = useState(true);
  const [isFetchingItens, setIsFetchingItens] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setIsFetchingProjeto(true);
    setIsFetchingItens(true);
    axios
      .get(`/projeto/${id}`)
      .then((response) => {
        if (response.data.results[0] === null) {
          setNotFound(true);
        }
        setProjeto(response.data.results[0] || {});
      })
      .catch((e) => console.log(e))
      .finally(() => setIsFetchingProjeto(false));
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
      .catch((e) => console.log(e))
      .finally(() => setIsFetchingItens(false));
  }, [id]);

  const isFetching = isFetchingItens || isFetchingProjeto;

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

  //funcao para calcular diversos valores relativos as despesas ja cadastradas da lista itens
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

  //guardar os valores devolvidos na gru para mostrar no resumo
  const [totalDevolvidoGru, setTotalDevolvidoGru] = useState({
    capital: 0,
    custeio: 0,
  });

  //funcao para calcular quais itens tem mudancas nao salvas para mostrar
  //na secao de verificar itens
  function getDirtyItens() {
    const filtered = itens.filter(
      (item) => item.isDirty || (item.warnings && item.warnings[2])
    );
    return filtered;
  }
  const dirtyItens = getDirtyItens();

  //caso esteja carregando
  if (isFetching) {
    return <Loading />;
  }

  //caso o id do projeto da url nao exista no banco
  if (notFound) {
    return <NotFound404 />;
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
                  <p>
                    <strong>Devolvido GRU:</strong>
                  </p>
                  <p>
                    {totalDevolvidoGru.custeio.toLocaleString("pt-br", {
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
                  <p>
                    <strong>Devolvido GRU:</strong>
                  </p>
                  <p>
                    {totalDevolvidoGru.capital.toLocaleString("pt-br", {
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
                  {(
                    totalDevolvidoGru.capital + totalDevolvidoGru.custeio
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

      {/* botao de download do relatorio */}
      <div className={style.buttonCreatePDF}>
        <button
          title="Clique aqui para gerar o PDF do relatório"
          onClick={handleRequestRelatorio}
        >
          <div className={style.divButtonCreatePDF}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
            </svg>
          </div>
        </button>
      </div>

      {/* modais */}
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

      {showDownloadingRelatorioModal && (
        <DownloadingRelatorioModal
          setShowModal={setShowDownloadingRelatorioModal}
          isDownloading={isDownloadingRelatorio}
        />
      )}

      {dirtyItens.length ? (
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
      ) : (
        ""
      )}
    </>
  );
}

//modal mostrado ao clicar no botao de gerar o relatorio
function DownloadingRelatorioModal({ isDownloading, setShowModal }) {
  function closeModal() {
    setShowModal(false);
  }
  return (
    <div onClick={closeModal} className="modalBackground">
      <div onClick={(e) => e.stopPropagation()} className={style.modalWarning}>
        <div className={style.tituloModal}>
          <div>
            <h2>
              {isDownloading ? "Baixando relatório..." : "Relatório baixado"}
            </h2>
          </div>
        </div>
        <div>
          {isDownloading ? (
            <Loading />
          ) : (
            <div style={{ margin: "1rem 1rem" }}>
              <h3>Como prosseguir:</h3>
              <br />
              <p>
                Para visualizar o relatório, extraia o conteúdo do arquivo
                baixado (relatório.zip) e abra o arquivo Relatório.pdf
              </p>
              <br />
              <p>
                Obs.: Não altere ou apague nenhum arquivo dentro do arquivo ZIP.
                Este é o que você deve enviar para avaliação.
              </p>
              <br />
              <br />
              <p>Tudo pronto :)</p>
              <p>
                Agora você já pode sair do sistema. Caso necessite realizar
                alterações, basta acessar essa página novamente e gerar um novo
                relatório, tudo que o foi feito até agora ficará salvo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//modal de warnings mostrado ao clicar no simbolo amarelo
//ao lado de itens, em campos com warnings ou na lista de itens para
//verificar no fim da tela
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
  //warnings a serem mostrados em tela
  const informacoes = warnings ? warnings[0] : null;
  const orcamentos = warnings ? warnings[1] : null;

  //ref para realizar o scroll automatico ate um orcamento se for o caso
  const scrollToHighlitedField = useRef();

  //elementos montados dos warnings do item
  const informacoesContent = informacoes
    ? //para cada propriedade do item criar um elemento
      Object.keys(informacoes).reduce((result, propriedade) => {
        const warning = informacoes[propriedade];
        let name = getName(propriedade);
        if (warning) {
          //checar se o campo deve ser destacado em vermelho
          if (
            propriedade === highlitedFieldName &&
            (highlitedFieldNameIndex === undefined ||
              highlitedFieldNameIndex === null)
          ) {
            //colocar no inicio da lista em vermelho
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
          //se nao precisar ser destacado, adicionar ao fim da lista
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

  //elementos montados dos warnings dos orcamentos
  const orcamentoContent = orcamentos
    ? //para cada orcamento
      orcamentos.reduce((result, orcamento, i) => {
        let content = [];

        //para cada campo do orcamento, gerar um elemento
        Object.keys(orcamento).forEach((propriedade) => {
          const warning = orcamento[propriedade];
          let name = getName(propriedade);
          if (warning) {
            //checar se o campo deve ser destacado em vermelho
            if (
              propriedade === highlitedFieldName &&
              highlitedFieldNameIndex === i
            ) {
              //colocar no inicio da lista em vermelho
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
            //se nao precisar ser destacado, adicionar ao fim da lista
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

        //se houveram campos adicionados para o orcamento atual, criar um elemento para tal
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

  //usar o ref para scrollar ate o orcamento se for o caso no render inicial
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
    <div onClick={closeModal} className="modalBackground">
      <div onClick={(e) => e.stopPropagation()} className={style.modalWarning}>
        {/* anchor hidden para scrollar ate o orcamento se for o caso */}
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

//funcao para printar o nome do campo de acordo
//com o nome de sua propriedade no modal de warnings
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
