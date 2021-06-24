import axios from "../../../axios";
import { useEffect, useState } from "react";
import { getProjectArrays } from "../../../Helpers/EditarAdicionarUsuario";
import { MainContent } from "./Contents";

import style from "../../../assets/css/components/item.module.css";
import Loading from "../../Loading";
import {
  notEmptyCriteria,
  notMoreRecentThanCriteria,
  cnpjCriteria,
} from "../../FormInputs";

export default function Item({
  itens,
  index,
  setItens,
  dragHandleInnerProps,
  handleTogglingModal,
  dataLimiteEdital,
}) {
  const [content, setContent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [initialItem, setInitialItem] = useState(itens[index]); //informacoes ja salvas no banco
  const [item, setItem] = useState(itens[index]); //informacoes nao salvas (sendo escritas)
  const [anexoItem, setAnexoItem] = useState(); //onde o anexo é salvo apos a primeira requisicao pelo mesmo ou criacao

  const [initialOrcamentos, setInitialOrcamentos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [anexosOrcamentos, setAnexosOrcamentos] = useState([]);

  const [justificativa, setJustificativa] = useState({});
  const [anexoJustificativa, setAnexoJustificativa] = useState();

  const [isDirty, setIsDirty] = useState(false);
  const [dirtyItemFields, setDirtyItemFields] = useState({});
  const [dirtyOrcamentoFields, setDirtyOrcamentoFields] = useState([]);

  const [warnings, setWarnings] = useState({});
  const [warningsOrcamentos, setWarningsOrcamentos] = useState([]);

  function handleChangeContent(newContent) {
    if (content === newContent) setContent(null);
    else setContent(newContent);
  }

  function handleDelete() {
    if (item.id) {
      axios
        .delete("/item", { data: { itens: [item] } })
        .then(() => {
          updateLocalArray();
        })
        .catch((e) => console.log(e));
    } else {
      updateLocalArray();
    }

    function updateLocalArray() {
      const newItens = [...itens];
      newItens.splice(index, 1);
      setItens(newItens);
    }
  }

  function handleSave(itemToCopy, orcamentosToCopy) {
    let item = { ...itemToCopy };
    let orcamentos = JSON.parse(JSON.stringify(orcamentosToCopy));
    setIsSaving(true);

    //inferir tipo de despesa do item
    item.despesa = item.tipo === "materialPermanente" ? "capital" : "custeio";

    //cuidar das justificativas
    if (justificativa.actionAnexo === "post") {
      const formData = new FormData();
      formData.append("file", anexoJustificativa);
      axios
        .post(`/justificativa/${justificativa.id}/file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() =>
          setJustificativa({
            ...justificativa,
            actionAnexo: undefined,
            pathAnexo: true,
          })
        );
    } else if (justificativa.actionAnexo === "delete") {
      axios.delete(`/justificativa/${justificativa.id}/file`).then(() =>
        setJustificativa({
          ...justificativa,
          actionAnexo: undefined,
          pathAnexo: false,
        })
      );
    }
    //apaga-la caso o item nao seja mais de natureza singular
    if (!item.isNaturezaSingular && justificativa.id) {
      axios.delete(`/justificativa/${justificativa.id}`).then(() => {
        setAnexoJustificativa();
        setJustificativa({});
      });
    }

    //separar listas dos orcamentos para enviar
    //*mudar nome da funcao helper e seus retornos no futuro
    let { addedProjects: added, updatedProjects: updated } = getProjectArrays(
      initialOrcamentos,
      orcamentos
    );
    let deleted = [];
    initialOrcamentos.forEach((o) => {
      const wasDeleted = !Boolean(
        orcamentos.filter((o2) => o2.id === o.id).length
      );
      if (wasDeleted) deleted.push(o);
    });

    function update() {
      added.forEach((orcamento) => (orcamento.idItem = item.id));

      //separar requisicoes
      let actions = [axios.put("/item", { itens: [{ ...item }] })];

      //orcamentos
      if (added.length > 0)
        actions.push(
          axios.post("/orcamento", { orcamentos: added }).then((response) => {
            added = response.data.results;
          })
        );
      if (updated.length > 0)
        actions.push(axios.put("/orcamento", { orcamentos: updated }));
      if (deleted.length > 0)
        actions.push(
          axios.delete("/orcamento", { data: { orcamentos: deleted } })
        );

      //anexo do item
      if (item.actionAnexo === "delete")
        actions.push(
          axios.delete(`/item/${item.id}/file`).then(() => {
            item.pathAnexo = false;
            delete item.actionAnexo;
          })
        );
      else if (item.actionAnexo === "post") {
        let formData = new FormData();
        formData.append("file", anexoItem);
        actions.push(
          axios
            .post(`/item/${item.id}/file`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then(() => {
              item.pathAnexo = true;
              delete item.actionAnexo;
            })
        );
      }

      //anexos dos orcamentos
      for (const [i, orcamento] of orcamentos.entries()) {
        if (
          orcamento.actionAnexo === "post" &&
          orcamento.hasOwnProperty("id")
        ) {
          let formData = new FormData();
          formData.append("file", anexosOrcamentos[i]);
          actions.push(
            axios
              .post(`/orcamento/${orcamento.id}/file`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then(() => {
                orcamento.pathAnexo = true;
                delete orcamento.actionAnexo;
              })
          );
        } else if (orcamento.actionAnexo === "delete") {
          actions.push(
            axios.delete(`/orcamento/${orcamento.id}/file`).then(() => {
              delete orcamento.pathAnexo;
              delete orcamento.actionAnexo;
            })
          );
        }
      }
      return actions;
    }

    //setar os estados do item e orcamentos
    const actions = update();

    if (actions.length > 0) {
      Promise.allSettled(actions)
        .then(() => {
          //atualizar lista de itens do componente pai para refletir valores no resumo
          setItens((oldItens) => {
            const newItens = [...oldItens];
            newItens[index] = item;
            return newItens;
          });

          setItem(item);
          setInitialItem(item);
          setDirtyItemFields({});

          const orcs = updated.concat(added);
          setOrcamentos(orcs);
          setInitialOrcamentos(orcs);
          setDirtyOrcamentoFields([Array(orcs.length)]);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setIsSaving(false));
    } else setIsSaving(false);
  }

  //fetch orcamentos e justificativas
  useEffect(() => {
    //somente pegar orcamentos se o item estiver no banco
    if (item.id) {
      axios
        .get(`/orcamento?idItem=${item.id}`)
        .then((response) => {
          setOrcamentos(response.data.results);
          setWarningsOrcamentos(Array(response.data.results.length));
          setInitialOrcamentos(response.data.results);
          setAnexosOrcamentos(Array(response.data.results.length));
          setDirtyOrcamentoFields(Array(response.data.results.length));
        })
        .catch((e) => {
          console.log(e);
        });
      axios.get(`/justificativa?idItem=${item.id}`).then((response) => {
        setJustificativa(response.data.results[0] || {});
      });
    }
  }, [item.id]);

  //verificar se form sofreu mudanças
  useEffect(() => {
    const isJustificativaDirty = Boolean(justificativa.actionAnexo);
    const isAnexoItemDirty = Boolean(item.actionAnexo);
    const isAnexoOrcamentoDirty = Boolean(
      orcamentos.filter((orcamento) => orcamento.actionAnexo).length
    );
    const isItemDirty = Object.keys(dirtyItemFields).length > 0;
    const isOrcamentosDirty =
      initialOrcamentos.length !== orcamentos.length ||
      dirtyOrcamentoFields.filter(
        (orcamento) => orcamento && Object.keys(orcamento).length > 0
      ).length > 0;

    const value =
      isAnexoItemDirty ||
      isAnexoOrcamentoDirty ||
      isJustificativaDirty ||
      isItemDirty ||
      isOrcamentosDirty;
    setIsDirty(value);
  }, [
    dirtyOrcamentoFields,
    dirtyItemFields,
    justificativa.actionAnexo,
    item.actionAnexo,
    orcamentos,
    initialOrcamentos,
    setItens,
    initialItem.posicao,
  ]);

  //verificar se posicao sofreu mudancas por drag and drop
  const posicao = itens[index].posicao;
  useEffect(() => {
    setItem((oldItem) => {
      return { ...oldItem, posicao: posicao };
    });
    setInitialItem((oldInitialItem) => {
      return { ...oldInitialItem, posicao: posicao };
    });
  }, [posicao]);

  //warnings
  //estado para saber se deve permitir ou não salvar
  //(não deve ser possível salvar com cnpjs invalidos)
  const [thereAreWrongCnpjs, setThereAreWrongCnpjs] = useState(false);

  //setar warnings
  useEffect(() => {
    if (!item || !orcamentos) return;

    let foundWrongCnpjs = false;
    function checkFields(newWarnings, initial, target) {
      //check things
      const pathAnexo = notEmptyCriteria(initial["pathAnexo"]);
      const actionAnexo = initial["actionAnexo"] !== "post";
      newWarnings["pathAnexo"] =
        pathAnexo[0] && actionAnexo
          ? "Nenhum documento foi anexado"
          : undefined;

      const nome = notEmptyCriteria(initial["nomeMaterialServico"]);
      newWarnings["nomeMaterialServico"] = nome[0] ? nome[1] : undefined;

      const marca = notEmptyCriteria(initial["marca"]);
      newWarnings["marca"] = marca[0] ? marca[1] : undefined;

      const modelo = notEmptyCriteria(initial["modelo"]);
      newWarnings["modelo"] = modelo[0] ? modelo[1] : undefined;

      let cnpjFavorecido = notEmptyCriteria(initial["cnpjFavorecido"]);
      if (cnpjFavorecido[0]) {
        newWarnings["cnpjFavorecido"] = cnpjFavorecido[1];
      } else {
        cnpjFavorecido = cnpjCriteria(initial["cnpjFavorecido"]);
        newWarnings["cnpjFavorecido"] = cnpjFavorecido[0]
          ? cnpjFavorecido[1]
          : undefined;

        if (!foundWrongCnpjs && cnpjFavorecido[0]) {
          foundWrongCnpjs = true;
          setThereAreWrongCnpjs(true);
        } else if (!foundWrongCnpjs) {
          setThereAreWrongCnpjs(false);
        }
      }

      const quantidade = notEmptyCriteria(initial["quantidade"]);
      newWarnings["quantidade"] = quantidade[0] ? quantidade[1] : undefined;

      const valorUnitario = notEmptyCriteria(initial["valorUnitario"]);
      newWarnings["valorUnitario"] = valorUnitario[0]
        ? valorUnitario[1]
        : undefined;

      const frete = notEmptyCriteria(initial["frete"]);
      newWarnings["frete"] = frete[0] ? frete[1] : undefined;

      const valorTotal = notEmptyCriteria(initial["valorTotal"]);
      newWarnings["valorTotal"] = valorTotal[0] ? valorTotal[1] : undefined;

      if (target === "orcamento") {
        newWarnings["isOrcadoComCpfCoordenador"] =
          initial.isOrcadoComCpfCoordenador
            ? undefined
            : "Não orçado com o CPF do coordenador";

        let dataOrcamento = notEmptyCriteria(initial["dataOrcamento"]);
        if (dataOrcamento[0]) {
          newWarnings["dataOrcamento"] = dataOrcamento[1];
        } else {
          dataOrcamento = notMoreRecentThanCriteria(
            initial["dataOrcamento"],
            dataLimiteEdital
          );
          newWarnings["dataOrcamento"] = dataOrcamento[0]
            ? `Orçamento feito após a data limite estipulada no edital ${dataLimiteEdital}`
            : undefined;
        }
      } else if (target === "item") {
        newWarnings["isCompradoComCpfCoordenador"] =
          initial.isCompradoComCpfCoordenador
            ? undefined
            : "Não comprado com o CPF do coordenador";

        const descricao = notEmptyCriteria(initial["descricao"]);
        newWarnings["descricao"] = descricao[0] ? descricao[1] : undefined;

        const tipo = notEmptyCriteria(initial["tipo"]);
        newWarnings["tipo"] = tipo[0] ? tipo[1] : undefined;

        const tipoDocumentoFiscal = notEmptyCriteria(
          initial["tipoDocumentoFiscal"]
        );
        newWarnings["tipoDocumentoFiscal"] = tipoDocumentoFiscal[0]
          ? tipoDocumentoFiscal[1]
          : undefined;

        let dataCompra = notEmptyCriteria(initial["dataCompraContratacao"]);
        if (dataCompra[0]) {
          newWarnings["dataCompraContratacao"] = dataCompra[1];
        } else {
          dataCompra = notMoreRecentThanCriteria(
            initial["dataCompraContratacao"],
            dataLimiteEdital
          );
          newWarnings["dataCompraContratacao"] = dataCompra[0]
            ? `Compra feita após a data limite estipulada no edital ${dataLimiteEdital}`
            : undefined;
        }

        const numeroDocumentoFiscal = notEmptyCriteria(
          initial["numeroDocumentoFiscal"]
        );
        newWarnings["numeroDocumentoFiscal"] = numeroDocumentoFiscal[0]
          ? numeroDocumentoFiscal[1]
          : undefined;
      }

      return newWarnings;
    }

    //objeto com os warnings do item que dependem dos orcamentos
    let propriedadesParaAdicionarAoItem = {};

    //verificar se a quantidade de orcamentos é suficiente
    if (orcamentos.length < 3 && !item.isNaturezaSingular) {
      propriedadesParaAdicionarAoItem.quantidadeOrcamentos =
        "Você deve adicionar ao menos 3 orçamentos.";
      propriedadesParaAdicionarAoItem.justificativa = undefined;
    }
    //verificar se uma justificativa foi anexada
    else {
      propriedadesParaAdicionarAoItem.quantidadeOrcamentos = undefined;
      if (
        item.isNaturezaSingular &&
        !justificativa.pathAnexo &&
        justificativa.actionAnexo !== "post"
      ) {
        propriedadesParaAdicionarAoItem.justificativa =
          "Você deve adicionar uma justificativa";
      } else {
        propriedadesParaAdicionarAoItem.justificativa = undefined;
      }
    }

    setWarningsOrcamentos((oldWarnings) => {
      let newWarnings = JSON.parse(JSON.stringify(oldWarnings));

      let existeOrcamentoReferenteACompra = false;
      for (let i = 0; i < orcamentos.length; i++) {
        if (orcamentos[i].isOrcamentoCompra)
          existeOrcamentoReferenteACompra = true;

        //verificar campos que podem ser avaliados individualmente
        if (!newWarnings[i]) newWarnings[i] = {};
        newWarnings[i] = checkFields(
          newWarnings[i],
          orcamentos[i],
          "orcamento"
        );

        //verificar se a data do orcamento é mais recente do que a compra
        const [isDateWrong, msg] = notMoreRecentThanCriteria(
          orcamentos[i].dataOrcamento,
          item.dataCompraContratacao
        );
        if (isDateWrong) newWarnings[i].dataOrcamento = msg;
      }

      if (!existeOrcamentoReferenteACompra) {
        propriedadesParaAdicionarAoItem.isOrcamentoCompra =
          "Não há nenhum orçamento referente à compra";
      } else {
        propriedadesParaAdicionarAoItem.isOrcamentoCompra = undefined;
      }

      return newWarnings;
    });

    setWarnings((oldWarnings) => {
      let newWarnings = { ...oldWarnings };
      newWarnings = checkFields(newWarnings, item, "item");
      newWarnings = { ...newWarnings, ...propriedadesParaAdicionarAoItem };

      return newWarnings;
    });
  }, [
    item,
    orcamentos,
    justificativa.pathAnexo,
    justificativa.actionAnexo,
    dataLimiteEdital,
  ]);

  //enviar warnings para a lista no componte pai
  useEffect(() => {
    function checkWarnigs(warnings) {
      if (!warnings || warnings.length !== 2) {
        return false;
      }
      if (
        Object.keys(warnings[0]).filter((propriedade) =>
          Boolean(warnings[0][propriedade])
        ).length > 0
      ) {
        return true;
      }
      for (const warningOrcameto of warnings[1]) {
        if (
          warningOrcameto &&
          Object.keys(warningOrcameto).filter((propriedade) =>
            Boolean(warningOrcameto[propriedade])
          ).length > 0
        ) {
          return true;
        }
      }
      return false;
    }
    const w = checkWarnigs([warnings, warningsOrcamentos]);
    setHasWarnings(w);
    setItens((oldItens) => {
      const newItens = JSON.parse(JSON.stringify(oldItens));
      newItens[index].isDirty = isDirty;
      newItens[index].warnings = [warnings, warningsOrcamentos, w];
      return newItens;
    });
  }, [warnings, warningsOrcamentos, index, setItens, isDirty]);

  const canSave = thereAreWrongCnpjs;

  const [hasWarnings, setHasWarnings] = useState(false);

  return (
    <div
      className={style.container}
      style={content ? {} : { marginBottom: "2rem" }}
    >
      <div className={style.handle}>
        <div {...dragHandleInnerProps} hidden={content}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
          </svg>
        </div>
      </div>
      <div className={style.main}>
        <div className={style.mainHeader}>
          <p>{item.nomeMaterialServico || "Novo item"}</p>
          <div>
            <span className={content === "informacoes" ? style.ticoAppear : ""}>
              <button
                onClick={() => handleChangeContent("informacoes")}
                className={
                  content === "informacoes" ? style.borderRadiusLeft : ""
                }
                style={{
                  borderRadius: "0.5rem 0 0 0.5rem",
                }}
              >
                Informações
              </button>
            </span>

            <span
              className={content === "orcamentos" ? style.ticoAppearWhite : ""}
            >
              <button
                onClick={() => handleChangeContent("orcamentos")}
                className={
                  content === "orcamentos" ? style.borderRadiusNone : ""
                }
              >
                Orçamentos
              </button>
            </span>

            <span
              className={content === "justificativa" ? style.ticoAppear : ""}
            >
              <button
                style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                onClick={() => handleChangeContent("justificativa")}
                disabled={!item.isNaturezaSingular}
                className={
                  content === "justificativa" ? style.borderRadiusRight : ""
                }
              >
                Justificativa
              </button>
            </span>
          </div>
        </div>
        {content && (
          <div className={style.mainContent}>
            {isSaving && <Loading />}
            <MainContent
              content={content}
              item={item}
              setItem={setItem}
              anexoItem={anexoItem}
              setAnexoItem={setAnexoItem}
              orcamentos={orcamentos}
              setOrcamentos={setOrcamentos}
              anexosOrcamentos={anexosOrcamentos}
              setAnexosOrcamentos={setAnexosOrcamentos}
              justificativa={justificativa}
              setJustificativa={setJustificativa}
              anexoJustificativa={anexoJustificativa}
              setAnexoJustificativa={setAnexoJustificativa}
              idItem={item.id}
              //dirty
              setDirtyItemFields={setDirtyItemFields}
              setDirtyOrcamentoFields={setDirtyOrcamentoFields}
              initialItem={initialItem}
              initialOrcamentos={initialOrcamentos}
              //warnings
              warnings={warnings}
              warningsOrcamentos={warningsOrcamentos}
              setWarningsOrcamentos={setWarningsOrcamentos}
              handleTogglingModal={({ name, idx }) => {
                handleTogglingModal(index, {
                  highlitedFieldName: name,
                  index: idx,
                });
              }}
            />
          </div>
        )}
      </div>
      <div className={style.tools}>
        <div className={style.toolsActions}>
          <button
            onClick={
              !canSave
                ? () => handleSave(item, orcamentos)
                : () =>
                    handleTogglingModal(
                      index,
                      {},
                      "Antes de salvar, arrume os CNPJs inválidos:"
                    )
            }
            disabled={!isDirty || isSaving}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
            </svg>
          </button>
          <button onClick={handleDelete} disabled={isSaving}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
        {hasWarnings && (
          <WarningDiv
            warnings={warnings}
            handleTogglingModal={handleTogglingModal}
            index={index}
          />
        )}
      </div>
    </div>
  );
}

function WarningDiv({ handleTogglingModal, index }) {
  return (
    <div className={style.toolsWarning}>
      <svg
        onClick={() => handleTogglingModal(index, {})}
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
    </div>
  );
}
