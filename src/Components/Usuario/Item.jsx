import axios from "../../axios";
import { useEffect, useRef, useState } from "react";
import { getProjectArrays } from "../../Helpers/EditarAdicionarUsuario";

import style from "../../assets/css/components/item.module.css";
import Loading from "../Loading";

export default function Item({ itens, index, setItens }) {
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
    const despesa = item.tipo === "materialPermanente" ? "capital" : "custeio";

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

    //definir se os orcamentos e justificativas tem que esperar pela criacao do ID do item
    const isItemInDB = item.id !== undefined;

    async function create() {
      const res = await axios.post("/item", {
        itens: [{ ...item, despesa: despesa }],
      });

      //setando aqui, antes do promise.all para caso o actions tenha tamenho zero
      setItem(res.data.results[0]);
      setInitialItem(res.data.results[0]);

      const idItem = res.data.results[0].id;

      added.forEach((orcamento) => (orcamento.idItem = idItem));

      //separar requisicoes
      let actions = [];

      //orcamentos
      if (added.length > 0)
        actions.push(
          axios.post("/orcamento", { orcamentos: added }).then((response) => {
            added = response.data.results;
          })
        );

      //anexo do item
      if (item.actionAnexo === "post") {
        let formData = new FormData();
        formData.append("file", anexoItem);
        actions.push(
          axios
            .post(`/item/${idItem}/file`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then(() => {
              item = res.data.results[0];
              item.pathAnexo = true;
              delete item.actionAnexo;
            })
        );
      }
      return actions;
    }

    function update() {
      added.forEach((orcamento) => (orcamento.idItem = item.id));

      //separar requisicoes
      let actions = [
        axios.put("/item", { itens: [{ ...item, despesa: despesa }] }),
      ];

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
    setThings();

    async function setThings() {
      let actions;
      if (isItemInDB) {
        actions = update();
      } else {
        actions = await create();
      }

      if (actions.length > 0) {
        Promise.allSettled(actions)
          .then(() => {
            setItem(item);
            setInitialItem(item);

            const orcs = updated.concat(added);
            setOrcamentos(orcs);
            setInitialOrcamentos(orcs);
          })
          .catch((e) => {
            console.log(e);
            console.log("in catch all");
          })
          .finally(() => setIsSaving(false));
      } else setIsSaving(false);
    }
  }

  //fetch orcamentos e justificativas
  useEffect(() => {
    //somente pegar orcamentos se o item estiver no banco
    if (item.id) {
      axios
        .get(`/orcamento?idItem=${item.id}`)
        .then((response) => {
          setOrcamentos(response.data.results);
          setInitialOrcamentos(response.data.results);
          setAnexosOrcamentos(Array(response.data.results.length));
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
    function checkDirty() {
      if (justificativa.actionAnexo) return true;
      const isItemDirty = !compareObjects(item, initialItem);
      let isOrcamentosDirty =
        orcamentos.length !== initialOrcamentos.length ? true : false;

      if (
        orcamentos.length > 0 &&
        initialOrcamentos.length > 0 &&
        !isOrcamentosDirty
      ) {
        for (const [i] of orcamentos.entries()) {
          if (!compareObjects(orcamentos[i], initialOrcamentos[i])) {
            isOrcamentosDirty = true;
            break;
          }
        }
      }

      return isItemDirty || isOrcamentosDirty;
    }
    setIsDirty(checkDirty);
  }, [
    item,
    orcamentos,
    initialOrcamentos,
    initialItem,
    justificativa.actionAnexo,
  ]);

  return (
    <div
      className={style.container}
      style={content ? {} : { marginBottom: "2rem" }}
    >
      <div className={style.main}>
        <div className={style.mainHeader}>
          <p>{item.nomeMaterialServico || "Novo item"}</p>
          <div>
            <span className={content === "informacoes" ? style.ticoAppear : ""}>
              <button onClick={() => handleChangeContent("informacoes")}>
                informações
              </button>
            </span>

            <span
              className={content === "orcamentos" ? style.ticoAppearWhite : ""}
            >
              <button onClick={() => handleChangeContent("orcamentos")}>
                orçamentos
              </button>
            </span>

            <span
              className={content === "justificativa" ? style.ticoAppear : ""}
            >
              <button
                onClick={() => handleChangeContent("justificativa")}
                disabled={!item.isNaturezaSingular}
              >
                justificativa
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
            />
          </div>
        )}
      </div>
      <div className={style.tools}>
        <button
          onClick={() => handleSave(item, orcamentos)}
          disabled={!isDirty || isSaving}
        >
          save
        </button>
        <button onClick={handleDelete} disabled={isSaving}>
          delete
        </button>
      </div>
    </div>
  );
}

function MainContent({
  content,
  item,
  setItem,
  anexoItem,
  setAnexoItem,
  orcamentos,
  setOrcamentos,
  anexosOrcamentos,
  setAnexosOrcamentos,
  justificativa,
  setJustificativa,
  anexoJustificativa,
  setAnexoJustificativa,
  idItem,
}) {
  if (content === "informacoes")
    return (
      <ContentInformacoes
        item={item}
        setItem={setItem}
        anexoItem={anexoItem}
        setAnexoItem={setAnexoItem}
      />
    );
  else if (content === "orcamentos")
    return (
      <ContentOrcamentos
        orcamentos={orcamentos}
        setOrcamentos={setOrcamentos}
        anexosOrcamentos={anexosOrcamentos}
        setAnexosOrcamentos={setAnexosOrcamentos}
      />
    );
  else if (content === "justificativa") {
    return (
      <ContentJustificativa
        justificativa={justificativa}
        setJustificativa={setJustificativa}
        anexoJustificativa={anexoJustificativa}
        setAnexoJustificativa={setAnexoJustificativa}
        idItem={idItem}
      />
    );
  }
}

function ContentInformacoes({ item, setItem, anexoItem, setAnexoItem }) {
  useEffect(() => {
    if (!canBeNaturezaSingular(item.tipo)) {
      setItem((item) => {
        return { ...item, isNaturezaSingular: false };
      });
    }
  }, [item.tipo, setItem]);

  const canBeNaturezaSingular = (tipo) => {
    return [
      "servicoPessoaJuridica",
      "servicoPessoaFisica",
      "materialConsumo",
      "materialPermanente",
    ].includes(tipo);
  };

  return (
    <>
      <div className={style.mainContentHeader}></div>
      <div className={style.mainContentForm}>
        <div style={{ position: "relative" }}>
          <div className={style.mainContentFormTico}></div>
        </div>

        <div className={style.mainContentFormFields}>
          <div className={style.mainContentFormFieldsColumn}>
            <TextInput
              name="descricao"
              object={item}
              setObject={setItem}
              label={"Descrição"}
            />
            <SelectInput
              name="tipo"
              object={item}
              setObject={setItem}
              label={"Tipo"}
            >
              <option value="materialConsumo">Material de consumo</option>
              <option value="materialPermanente">Material permanente</option>
              <option value="servicoPessoaFisica">
                Serviço de terceiros (pessoa física)
              </option>
              <option value="servicoPessoaJuridica">
                Serviço de terceiros (pessoa jurídica)
              </option>
              <option value="hospedagem">Hospedagem</option>
              <option value="passagem">Passagem</option>
              <option value="alimentacao">Alimentação de estudantes</option>
            </SelectInput>
            <CheckBoxInput
              name="isNaturezaSingular"
              object={item}
              setObject={setItem}
              label={"Possui natureza singular ou fornecimento exclusivo"}
              disabled={!canBeNaturezaSingular(item.tipo)}
            />

            <div className={style.vh} />
            <div className={style.mainContentFormSubtitle}>
              <h3>Detalhamento</h3>
            </div>

            <TextInput
              name="nomeMaterialServico"
              object={item}
              setObject={setItem}
              label={"Nome do material / serviço"}
            />
            <TextInput
              name="marca"
              object={item}
              setObject={setItem}
              label={"Marca"}
            />
            <TextInput
              name="modelo"
              object={item}
              setObject={setItem}
              label={"Modelo"}
            />
            <SelectInput
              name="tipoDocumentoFiscal"
              object={item}
              setObject={setItem}
              label={"Tipo do documento fiscal"}
            >
              <option value="nf">Nota fiscal</option>
              <option value="cf">Cupom fiscal</option>
              <option value="passagem">
                Bilhete de passagem terrestre e/ou aérea
              </option>
            </SelectInput>
          </div>

          <div className={style.vl}>
            <div></div>
          </div>

          <div className={style.mainContentFormFieldsColumn}>
            <DateInput
              name="dataCompraContratacao"
              object={item}
              setObject={setItem}
              label={"Data da compra"}
            />
            <TextInput
              name="cnpjFavorecido"
              object={item}
              setObject={setItem}
              label={"Favorecido (CNPJ)"}
            />
            <TextInput
              name="quantidade"
              object={item}
              setObject={setItem}
              label={"quantidade"}
              isNumber={true}
              onChange={(e) => {
                setItem({
                  ...item,
                  quantidade: e.target.value,
                  valorTotal:
                    Number(item.valorUnitario) * Number(e.target.value) +
                    Number(item.frete),
                });
              }}
            />
            <TextInput
              name="valorUnitario"
              object={item}
              setObject={setItem}
              label={"Valor unitário"}
              isNumber={true}
              onChange={(e) => {
                setItem({
                  ...item,
                  valorUnitario: e.target.value,
                  valorTotal:
                    Number(e.target.value) * Number(item.quantidade) +
                    Number(item.frete),
                });
              }}
            />
            <TextInput
              name="frete"
              object={item}
              setObject={setItem}
              label={"Valor do frete"}
              isNumber={true}
              onChange={(e) => {
                setItem({
                  ...item,
                  frete: e.target.value,
                  valorTotal:
                    Number(item.valorUnitario) * Number(item.quantidade) +
                    Number(e.target.value),
                });
              }}
            />
            <TextInput
              name="valorTotal"
              object={item}
              setObject={setItem}
              label={"Valor total"}
              isNumber={true}
              disabled={true}
            />
            <TextInput
              name="numeroDocumentoFiscal"
              object={item}
              setObject={setItem}
              label={"N° do documento fiscal"}
              isNumber={true}
            />
          </div>
        </div>

        <div className={style.cpfPesquisadorCheckbox}>
          <CheckBoxInput
            name="isCompradoComCpfCoordenador"
            object={item}
            setObject={setItem}
            label={"Comprado com o CPF do coordenador"}
          />
        </div>

        <div className={style.mainContentFormFiles}>
          {item && setItem && (
            <AnexoRiseUpMenu
              item={item}
              setItem={setItem}
              anexos={anexoItem}
              setAnexos={setAnexoItem}
            />
          )}
        </div>
      </div>
    </>
  );
}

function ContentOrcamentos({
  orcamentos,
  setOrcamentos,
  anexosOrcamentos,
  setAnexosOrcamentos,
}) {
  const [current, setCurrent] = useState(0);
  const botoesRef = useRef();

  function handleChangeOrcamento(index) {
    if (index === current) setCurrent(0);
    else setCurrent(index);
  }

  function handleAddOrcamento() {
    const defaultOrcamento = {
      nomeMaterialServico: "",
      marca: "",
      modelo: "",
      dataOrcamento: "",
      cnpjFavorecido: "",
      quantidade: 0,
      valorUnitario: 0,
      valorTotal: 0,
      frete: 0,
      anexo: "",
      isOrcadoComCpfCoordenador: false,
    };

    setOrcamentos([...orcamentos, defaultOrcamento]);
    setCurrent(orcamentos.length + 1);
    //timeout porque isso so deve ocorrer somente depois das autalizacoes assima, que sao assincronas
    setTimeout(() => {
      scrollBotoesBy(9999999, 0);
    }, 1);

    //atualizar lista de anexos de acordo
    setAnexosOrcamentos([...anexosOrcamentos, undefined]);
  }

  function handleDeleteOrcamento(index) {
    if (index === current - 1) setCurrent(0);
    else if (index < current - 1) setCurrent(current - 1);

    let newOrcamentos = [...orcamentos];
    newOrcamentos.splice(index, 1);
    setOrcamentos(newOrcamentos);

    //atualizar lista de anexos de acordo
    let newAnexosOrcamentos = [...anexosOrcamentos];
    newAnexosOrcamentos.splice(index, 1);
    setAnexosOrcamentos(newAnexosOrcamentos);
  }

  function scrollBotoesBy(x, y) {
    botoesRef.current.scrollBy(x, y);
  }

  return (
    <>
      <div className={style.mainContentHeader}></div>
      <div className={style.mainContentForm}>
        <div
          className={style.mainContentFormOrcamentoSelector}
          style={!current ? { marginBottom: "2rem" } : {}}
        >
          <div></div>

          <div className={style.mainContentFormOrcamentoSelectorArrow}>
            <button onClick={() => scrollBotoesBy(-300, 0)}>&#11164;</button>
          </div>
          <div
            className={style.mainContentFormOrcamentoSelectorBotoes}
            ref={botoesRef}
          >
            {orcamentos.map((_, i) => (
              <span
                key={i}
                className={
                  current === i + 1
                    ? style.mainContentFormOrcamentoSelectorTarget
                    : style.mainContentFormOrcamentoSelectorUntarget
                }
              >
                <div onClick={() => handleChangeOrcamento(i + 1)}>
                  <p>Orçamento</p>
                  <p>{i + 1}</p>
                </div>
                <button onClick={() => handleDeleteOrcamento(i)}>
                  <svg height="24" viewBox="0 0 24 24" width="24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className={style.mainContentFormOrcamentoSelectorArrow}>
            <button onClick={() => scrollBotoesBy(300, 0)}>&#11166;</button>
          </div>
          <div className={style.mainContentFormOrcamentoSelectorAdd}>
            <button onClick={handleAddOrcamento}>+</button>
          </div>
        </div>

        {current && orcamentos[current - 1] ? (
          <>
            <div className={style.mainContentFormFields}>
              <div className={style.mainContentFormFieldsColumn}>
                <DateInput
                  name="dataOrcamento"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Data do orçamento"}
                />

                <div className={style.vh} />
                <div className={style.mainContentFormSubtitle}>
                  <h3>Detalhamento</h3>
                </div>

                <TextInput
                  name="nomeMaterialServico"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Nome do material / serviço"}
                />
                <TextInput
                  name="marca"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Marca"}
                />
                <TextInput
                  name="modelo"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Modelo"}
                />
              </div>

              <div className={style.vl} />

              <div className={style.mainContentFormFieldsColumn}>
                <TextInput
                  name="cnpjFavorecido"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Favorecido (CNPJ)"}
                />
                <TextInput
                  name="quantidade"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"quantidade"}
                  isNumber={true}
                  onChange={(e) => {
                    let newOrcamentos = JSON.parse(JSON.stringify(orcamentos));
                    newOrcamentos[current - 1].quantidade = Number(
                      e.target.value
                    );
                    newOrcamentos[current - 1].valorTotal =
                      Number(e.target.value) *
                        Number(newOrcamentos[current - 1].valorUnitario) +
                      Number(newOrcamentos[current - 1].frete);
                    setOrcamentos(newOrcamentos);
                  }}
                />
                <TextInput
                  name="valorUnitario"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor unitário"}
                  isNumber={true}
                  onChange={(e) => {
                    let newOrcamentos = JSON.parse(JSON.stringify(orcamentos));
                    newOrcamentos[current - 1].valorUnitario = Number(
                      e.target.value
                    );
                    newOrcamentos[current - 1].valorTotal =
                      Number(e.target.value) *
                        Number(newOrcamentos[current - 1].quantidade) +
                      Number(newOrcamentos[current - 1].frete);
                    setOrcamentos(newOrcamentos);
                  }}
                />
                <TextInput
                  name="frete"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor do frete"}
                  isNumber={true}
                  onChange={(e) => {
                    let newOrcamentos = JSON.parse(JSON.stringify(orcamentos));
                    newOrcamentos[current - 1].frete = Number(e.target.value);
                    newOrcamentos[current - 1].valorTotal =
                      Number(newOrcamentos[current - 1].quantidade) *
                        Number(newOrcamentos[current - 1].valorUnitario) +
                      Number(e.target.value);
                    setOrcamentos(newOrcamentos);
                  }}
                />
                <TextInput
                  name="valorTotal"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor total"}
                  isNumber={true}
                  disabled={true}
                />
              </div>
            </div>
            <div className={style.cpfPesquisadorCheckbox}>
              <CheckBoxInput
                name="isOrcadoComCpfCoordenador"
                object={orcamentos}
                setObject={setOrcamentos}
                index={current - 1}
                label={"Orçado com o CPF do coordenador"}
              />
            </div>
            <div className={style.mainContentFormFiles}>
              {orcamentos && setOrcamentos && (
                <AnexoRiseUpMenu
                  item={orcamentos}
                  setItem={setOrcamentos}
                  index={current - 1}
                  anexos={anexosOrcamentos}
                  setAnexos={setAnexosOrcamentos}
                />
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function ContentJustificativa({
  justificativa,
  setJustificativa,
  anexoJustificativa,
  setAnexoJustificativa,
  idItem,
}) {
  const [isPosting, setIsPosting] = useState(false);
  //criar uma justificativa para o item caso ele nao tenha
  useEffect(() => {
    if (
      !justificativa.hasOwnProperty("id") &&
      idItem !== null &&
      idItem !== undefined
    ) {
      setIsPosting(true);
      axios.post(`/justificativa`, { idItem: idItem }).then((response) => {
        setJustificativa(response.data.results[0]);
        setIsPosting(false);
      });
    }
  }, [justificativa, setJustificativa, idItem]);
  return (
    <>
      <div className={style.mainContentHeader}></div>
      <div className={style.mainContentForm}>
        <div style={{ position: "relative" }}>
          <div className={style.mainContentFormTico}></div>
        </div>

        <div className={style.mainContentJustificativaForm}>
          {isPosting && <Loading />}

          {idItem === null || idItem === undefined ? (
            <h3>Salve o item antes de adicionar uma justificativa</h3>
          ) : (
            justificativa.id && (
              <AnexoContent
                item={justificativa}
                setItem={setJustificativa}
                anexos={anexoJustificativa}
                setAnexos={setAnexoJustificativa}
                isJustificativa={true}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}

function AnexoRiseUpMenu({ item, setItem, index = null, anexos, setAnexos }) {
  const [isAnexoOpen, setIsAnexoOpen] = useState(false);
  return (
    <div
      className={style.anexoRiseUpMenu}
      style={isAnexoOpen ? { height: "15rem" } : { height: "2rem" }}
    >
      <button onClick={() => setIsAnexoOpen(!isAnexoOpen)}>
        Anexar documento fiscal
      </button>
      <AnexoContent
        item={item}
        setItem={setItem}
        index={index}
        anexos={anexos}
        setAnexos={setAnexos}
        isAnexoOpen={isAnexoOpen}
        setIsAnexoOpen={setIsAnexoOpen}
      />
    </div>
  );
}

function AnexoContent({
  item,
  setItem,
  index = null,
  anexos,
  setAnexos,
  isAnexoOpen = true,
  setIsAnexoOpen = () => {},
  isJustificativa = false,
}) {
  const [blob, setBlob] = useState();
  const [isFetching, setIsFetching] = useState(false);

  function handleFileChange(e) {
    let file = e.target.files[0];
    console.log(file);
    if (!file) {
      desanexar();
      return;
    }

    file.ext = getFileExtension(file.type);

    if (index === null) {
      setAnexos(file);
      setItem((oldItem) => {
        return { ...oldItem, actionAnexo: "post" };
      });
      if (blob) setBlob(); //é setado no useEffect caso nao haja outro blob ja setado
    } else {
      const newFiles = [...anexos];
      const newObject = JSON.parse(JSON.stringify(item));

      newFiles[index] = file;
      newObject[index].actionAnexo = "post";

      setAnexos(newFiles);
      setItem(newObject);
      if (blob) setBlob(); //é setado no useEffect caso nao haja outro blob ja setado
    }
  }

  function desanexar() {
    setBlob();

    if (index === null) {
      const newObject = { ...item };
      if (newObject.pathAnexo) newObject.actionAnexo = "delete";
      else delete newObject.actionAnexo;
      setItem(newObject);
      setAnexos();
    } else {
      const newFiles = [...anexos];
      newFiles[index] = undefined;
      setAnexos(newFiles);
      const newObject = JSON.parse(JSON.stringify(item));
      if (item[index].pathAnexo) newObject[index].actionAnexo = "delete";
      else delete newObject[index].actionAnexo;
      setItem(newObject);
    }
  }

  function getFileExtension(mime) {
    switch (mime) {
      case "image/png":
        return "png";
      case "image/jpg":
        return "jpg";
      case "image/jpeg":
        return "jpeg";
      case "application/pdf":
        return "pdf";
      default:
        return "txt";
    }
  }

  useEffect(() => {
    function fetchFiles() {
      setIsFetching(true);
      if (index !== null) {
        axios.get(`/orcamento/${item[index].id}/file`).then((response) => {
          const mime = response.data.fileMime;
          const array = [new Uint8Array(response.data.file.data)];
          const blob = new Blob(array, { type: mime });
          blob.ext = getFileExtension(blob.type);

          let newObject = [...anexos];
          newObject[index] = blob;
          setAnexos(newObject);
          // setBlob(blob);
          setIsFetching(false);
        });
      } else {
        const url = isJustificativa
          ? `/justificativa/${item.id}/file`
          : `/item/${item.id}/file`;
        axios.get(url).then((response) => {
          const mime = response.data.fileMime;
          const array = [new Uint8Array(response.data.file.data)];
          const blob = new Blob(array, { type: mime });
          blob.ext = getFileExtension(blob.type);

          setAnexos(blob);
          // setBlob(blob);
          setIsFetching(false);
        });
      }
    }

    if (isAnexoOpen && !blob) {
      if (index !== null) {
        if (anexos[index]) setBlob(anexos[index]);
        else if (item[index].pathAnexo && item[index].actionAnexo !== "delete")
          fetchFiles();
      } else {
        if (anexos) setBlob(anexos);
        else if (item.pathAnexo && item.actionAnexo !== "delete") fetchFiles();
      }
    }
  }, [
    isAnexoOpen,
    blob,
    index,
    item,
    setItem,
    anexos,
    setAnexos,
    isJustificativa,
  ]);

  useEffect(() => {
    if (isJustificativa === true) return;

    setBlob();
    setIsAnexoOpen(false);
  }, [index, setIsAnexoOpen, isJustificativa]);

  let hasId = true;
  if (index !== null) hasId = item[index].hasOwnProperty("id");

  const blobURL = blob ? URL.createObjectURL(blob) : "";

  return (
    <div
      className={style.anexoRiseUpMenuContent}
      style={!isAnexoOpen ? { display: "none" } : {}}
    >
      {hasId ? (
        <>
          {isFetching && <Loading />}
          <div>
            <label
              className={style.anexoRiseUpMenuContentSelecionar}
              htmlFor="a"
            >
              {!blob ? "Selecionar arquivo" : "Alterar arquivo"}
            </label>
            <input
              id="a"
              type="file"
              onClick={(e) => (e.target.value = null)}
              onChange={handleFileChange}
              hidden
              accept=".pdf,.jpeg,.jpg,.png"
              disabled={isFetching}
            />
          </div>
          {!blob ? (
            "não anexado"
          ) : (
            <a href={blobURL} target="_blank" rel="noreferrer">
              {"visualizar"}
            </a>
          )}
          <div>
            <a
              className={style.anexoRiseUpMenuContentDownload}
              download={blob ? "anexo." + blob.ext : "anexo"}
              href={blobURL}
              style={!blob ? { pointerEvents: "none", opacity: "50%" } : {}}
            >
              Download
            </a>
            ou
            <button
              className={style.anexoRiseUpMenuContentRemove}
              onClick={desanexar}
              disabled={!blob}
            >
              Desanexar
            </button>
          </div>
        </>
      ) : (
        "Salve o orçamento antes de anexar"
      )}
    </div>
  );
}

function TextInput({
  name,
  object,
  setObject,
  index = null,
  label,
  isNumber = false,
  ...rest
}) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <input
        id={name}
        type={isNumber ? "number" : "text"}
        value={index === null ? object[name] : object[index][name]}
        onChange={(e) =>
          handleChange(e, name, object, setObject, index, isNumber)
        }
        {...rest}
      />
    </div>
  );
}

function SelectInput({
  name,
  object,
  setObject,
  index = null,
  children,
  label,
}) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <select
        id={name}
        type="text"
        value={index === null ? object[name] : object[index][name]}
        onChange={(e) => handleChange(e, name, object, setObject, index)}
      >
        {children}
      </select>
    </div>
  );
}

function DateInput({ name, object, setObject, index = null, label }) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <input
        id={name}
        type="date"
        value={index === null ? object[name] : object[index][name]}
        onChange={(e) => handleChange(e, name, object, setObject, index)}
      />
    </div>
  );
}

function CheckBoxInput({
  name,
  object,
  setObject,
  index = null,
  label,
  ...rest
}) {
  function handleChange() {
    //caso seja parte de uma lista de objetos
    if (index !== null) {
      let newObject = JSON.parse(JSON.stringify(object));
      newObject[index][name] = !object[index][name];
      setObject(newObject);
      return;
    }
    //caso seja parte de um objeto apenas
    setObject({ ...object, [name]: !object[name] });
  }

  const checked = index === null ? object[name] : object[index][name];
  return (
    <div className={style.checkBoxLabelGroup}>
      <input
        id={name}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...rest}
      />
      <label htmlFor={name}>{label || name}</label>
    </div>
  );
}

function handleChange(e, name, object, setObject, index, isNumber = false) {
  let value =
    isNumber && e.target.value ? Number(e.target.value) : e.target.value;
  //caso seja parte de uma lista de objetos
  if (index !== null) {
    let newObject = JSON.parse(JSON.stringify(object));
    newObject[index][name] = value;
    setObject(newObject);
    return;
  }
  //caso seja parte de um objeto apenas
  setObject({ ...object, [name]: value });
}

function compareObjects(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (key === "anexo") {
    }
    // eslint-disable-next-line
    if (object1[key] != object2[key]) {
      return false;
    }
  }

  return true;
}
