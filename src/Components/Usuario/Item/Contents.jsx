import style from "../../../assets/css/components/item.module.css";
import axios, { fileBufferAxios } from "../../../axios";
import { useEffect, useRef, useState } from "react";
import Loading from "../../Loading";
import {
  TextInput,
  SelectInput,
  DateInput,
  CheckBoxInput,
} from "../../FormInputs";

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
  //dirty
  setDirtyItemFields,
  setDirtyOrcamentoFields,
  initialItem,
  initialOrcamentos,
  //warnings
  warnings,
  warningsOrcamentos,
  setWarningsOrcamentos,
  handleTogglingModal,
}) {
  if (content === "informacoes")
    return (
      <ContentInformacoes
        item={item}
        setItem={setItem}
        anexoItem={anexoItem}
        setAnexoItem={setAnexoItem}
        setDirtyItemFields={setDirtyItemFields}
        initialItem={initialItem}
        warnings={warnings}
        handleTogglingModal={handleTogglingModal}
      />
    );
  else if (content === "orcamentos")
    return (
      <ContentOrcamentos
        orcamentos={orcamentos}
        setOrcamentos={setOrcamentos}
        anexosOrcamentos={anexosOrcamentos}
        setAnexosOrcamentos={setAnexosOrcamentos}
        setDirtyOrcamentoFields={setDirtyOrcamentoFields}
        initialOrcamentos={initialOrcamentos}
        warningsOrcamentos={warningsOrcamentos}
        setWarningsOrcamentos={setWarningsOrcamentos}
        handleTogglingModal={handleTogglingModal}
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

function ContentInformacoes({
  item,
  setItem,
  anexoItem,
  setAnexoItem,
  setDirtyItemFields,
  initialItem,
  warnings,
  handleTogglingModal,
}) {
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
      <div className={style.mainContentHeader}>
        <h3>Informa????es</h3>
      </div>
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
              label={"Descri????o"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
            <SelectInput
              name="tipo"
              object={item}
              setObject={setItem}
              label={"Tipo"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            >
              <option value="materialConsumo">Material de consumo</option>
              <option value="materialPermanente">Material permanente</option>
              <option value="servicoPessoaFisica">
                Servi??o de terceiros (pessoa f??sica)
              </option>
              <option value="servicoPessoaJuridica">
                Servi??o de terceiros (pessoa jur??dica)
              </option>
              <option value="hospedagem">Hospedagem</option>
              <option value="passagem">Passagem</option>
              <option value="alimentacao">Alimenta????o de estudantes</option>
            </SelectInput>
            <CheckBoxInput
              name="isNaturezaSingular"
              object={item}
              setObject={setItem}
              label={"Possui natureza singular ou fornecimento exclusivo"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
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
              label={"Nome do material / servi??o"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="marca"
              object={item}
              setObject={setItem}
              label={"Marca"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="modelo"
              object={item}
              setObject={setItem}
              label={"Modelo"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
            <SelectInput
              name="tipoDocumentoFiscal"
              object={item}
              setObject={setItem}
              label={"Tipo do documento fiscal"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            >
              <option value="nf">Nota fiscal</option>
              <option value="cf">Cupom fiscal</option>
              <option value="passagem">
                Bilhete de passagem terrestre e/ou a??rea
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
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="cnpjFavorecido"
              object={item}
              setObject={setItem}
              label={"Favorecido (CNPJ)"}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
              maxLength={14 + 4}
            />
            <TextInput
              name="quantidade"
              object={item}
              setObject={setItem}
              label={"Quantidade"}
              isNumber={true}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              onChangeExtra={(newItem, _, value) => {
                newItem.valorTotal =
                  Number(value) * Number(newItem.valorUnitario) +
                  Number(newItem.frete);
                return newItem;
              }}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="valorUnitario"
              object={item}
              setObject={setItem}
              label={"Valor unit??rio"}
              isNumber={true}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              onChangeExtra={(newItem, _, value) => {
                newItem.valorTotal =
                  Number(value) * Number(newItem.quantidade) +
                  Number(newItem.frete);
                return newItem;
              }}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="frete"
              object={item}
              setObject={setItem}
              label={"Valor do frete"}
              isNumber={true}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              onChangeExtra={(newItem, _, value) => {
                newItem.valorTotal =
                  Number(newItem.quantidade) * Number(newItem.valorUnitario) +
                  Number(value);
                return newItem;
              }}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="valorTotal"
              object={item}
              setObject={setItem}
              label={"Valor total"}
              isNumber={true}
              warnings={warnings}
              disabled={true}
              handleTogglingModal={handleTogglingModal}
            />
            <TextInput
              name="numeroDocumentoFiscal"
              object={item}
              setObject={setItem}
              label={"N?? do documento fiscal"}
              isNumber={true}
              objectToCompare={initialItem}
              setDirtyFields={setDirtyItemFields}
              warnings={warnings}
              handleTogglingModal={handleTogglingModal}
            />
          </div>
        </div>

        <div className={style.cpfPesquisadorCheckbox}>
          <CheckBoxInput
            name="isCompradoComCpfCoordenador"
            object={item}
            setObject={setItem}
            label={"Comprado com o CPF do coordenador"}
            objectToCompare={initialItem}
            setDirtyFields={setDirtyItemFields}
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
  setDirtyOrcamentoFields,
  initialOrcamentos,
  warningsOrcamentos,
  setWarningsOrcamentos,
  handleTogglingModal,
}) {
  const [current, setCurrent] = useState(0);
  const botoesRef = useRef();

  function handleChangeOrcamento(index) {
    if (index === current) setCurrent(0);
    else setCurrent(index);
  }

  function handleAddOrcamento() {
    setOrcamentos([...orcamentos, {}]);
    setCurrent(orcamentos.length + 1);
    //timeout porque isso so deve ocorrer somente depois das autalizacoes assima, que sao assincronas
    setTimeout(() => {
      scrollBotoesBy(9999999, 0);
    }, 1);

    //atualizar lista de anexos de acordo
    setAnexosOrcamentos([...anexosOrcamentos, undefined]);

    //atualizar lista de alteracoes dos campos de acordo
    setDirtyOrcamentoFields((oldDirty) => [...oldDirty, {}]);

    //atualizar lista de warnings de acordo
    setWarningsOrcamentos((oldWarnings) => [...oldWarnings, {}]);
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

    //atualizar lista de alteracoes dos campos de acordo
    setDirtyOrcamentoFields((oldDirty) => {
      const newDirty = [...oldDirty];
      newDirty.splice(index, 1);
      return newDirty;
    });

    //atualizar lista de warnings de acordo
    setWarningsOrcamentos((oldWarnings) => {
      const newWarnings = [...oldWarnings];
      newWarnings.splice(index, 1);
      return newWarnings;
    });
  }

  function handleSetOrcamentoCompra(index) {
    let newOrcamentos = JSON.parse(JSON.stringify(orcamentos));
    //caso o orcamento clicado seja o atual orcacmentoCompra
    if (orcamentos[index].isOrcamentoCompra) {
      newOrcamentos[index].isOrcamentoCompra = false;
      setOrcamentos(newOrcamentos);

      setDirtyOrcamentoFields((oldDirty) => {
        const newDirty = [...oldDirty];
        if (!newDirty[index]) newDirty[index] = {};
        //caso nao esteja no banco
        if (initialOrcamentos.length - 1 < index) {
          newDirty[index].isOrcamentoCompra = true;
        }
        //caso nao esteja
        else if (initialOrcamentos[index].isOrcamentoCompra) {
          newDirty[index].isOrcamentoCompra = true;
        } else {
          delete newDirty[index].isOrcamentoCompra;
        }
        return newDirty;
      });
      return;
    }
    let nenhumOrcamentoIsCompra = true;

    //procurar pelo orcamentoCompra atual
    newOrcamentos.forEach((orcamento, i) => {
      if (orcamento.isOrcamentoCompra) {
        orcamento.isOrcamentoCompra = false;
        //setar mudancas
        setDirtyOrcamentoFields((oldDirty) => {
          //orcamentoCompra atual
          const newDirty = [...oldDirty];
          if (!newDirty[i]) newDirty[i] = {};
          //caso nao esteja no banco
          if (initialOrcamentos.length - 1 < i) {
            delete newDirty[i].isOrcamentoCompra;
          }
          //caso esteja
          else if (initialOrcamentos[i].isOrcamentoCompra)
            newDirty[i].isOrcamentoCompra = true;
          else delete newDirty[i].isOrcamentoCompra;

          //novo orcamentoCompra
          if (!newDirty[index]) newDirty[index] = {};

          //caso nao esteja no banco
          if (initialOrcamentos.length - 1 < index) {
            newDirty[index].isOrcamentoCompra = true;
          }
          //caso nao esteja
          else if (!initialOrcamentos[index].isOrcamentoCompra) {
            newDirty[index].isOrcamentoCompra = true;
          } else delete newDirty[index].isOrcamentoCompra;
          return newDirty;
        });
        nenhumOrcamentoIsCompra = false;
        return;
      }
    });
    newOrcamentos[index].isOrcamentoCompra = true;
    //caso nenhum orcamentoCompra seja encontrado
    if (nenhumOrcamentoIsCompra) {
      //setar mudancas do novo orcamentoCompra
      setDirtyOrcamentoFields((oldDirty) => {
        const newDirty = [...oldDirty];

        if (!newDirty[index]) newDirty[index] = {};
        //caso nao esteja no banco
        if (initialOrcamentos.length - 1 < index) {
          newDirty[index].isOrcamentoCompra = true;
        }
        //caso nao esteja
        else if (!initialOrcamentos[index].isOrcamentoCompra)
          newDirty[index].isOrcamentoCompra = true;
        else delete newDirty[index].isOrcamentoCompra;
        return newDirty;
      });
    }
    setOrcamentos(newOrcamentos);
  }

  function scrollBotoesBy(x, y) {
    botoesRef.current.scrollBy(x, y);
  }

  return (
    <>
      <div className={style.mainContentHeader}>
        {current > 0 ? <h3>Or??amento {current}</h3> : <h3>Or??amentos</h3>}
      </div>
      <div className={style.mainContentForm}>
        <div className={style.helpPin}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <path
                  d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z"
                  fillRule="evenodd"
                />
              </g>
            </svg>
            <p> - marque o or??amente referente ?? compra!</p>
          </div>
        </div>

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
            style={
              orcamentos.length === 0
                ? { justifyContent: "center", alignItems: "center" }
                : {}
            }
            ref={botoesRef}
          >
            {orcamentos.length === 0 && (
              <span>Or??amentos adicionados aparecer??o aqui...</span>
            )}
            {orcamentos.map((orcamento, i) => (
              <span
                key={i}
                className={
                  current === i + 1
                    ? style.mainContentFormOrcamentoSelectorTarget
                    : style.mainContentFormOrcamentoSelectorUntarget
                }
              >
                <div onClick={() => handleChangeOrcamento(i + 1)}>
                  <p>Or??amento</p>
                  <p>{i + 1}</p>
                </div>
                <span>
                  <button
                    onClick={() => handleSetOrcamentoCompra(i)}
                    style={
                      orcamento.isOrcamentoCompra
                        ? { backgroundColor: "darkblue" }
                        : {}
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill={orcamento.isOrcamentoCompra ? "#ffffff" : "#000000"}
                    >
                      <g>
                        <rect fill="none" height="24" width="24" />
                      </g>
                      <g>
                        <path d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z" />
                      </g>
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteOrcamento(i)}>
                    <svg height="24" viewBox="0 0 24 24" width="24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </span>
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
                  label={"Data do or??amento"}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
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
                  label={"Nome do material / servi??o"}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                />
                <TextInput
                  name="marca"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Marca"}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                />
                <TextInput
                  name="modelo"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Modelo"}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
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
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                  maxLength={14 + 4}
                />
                <TextInput
                  name="quantidade"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Quantidade"}
                  isNumber={true}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  onChangeExtra={(newOrcamentos, index, value) => {
                    newOrcamentos[index].valorTotal =
                      Number(value) *
                        Number(newOrcamentos[index].valorUnitario) +
                      Number(newOrcamentos[index].frete);
                    return newOrcamentos;
                  }}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                />
                <TextInput
                  name="valorUnitario"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor unit??rio"}
                  isNumber={true}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  onChangeExtra={(newOrcamentos, index, value) => {
                    newOrcamentos[index].valorTotal =
                      Number(value) * Number(newOrcamentos[index].quantidade) +
                      Number(newOrcamentos[index].frete);
                    return newOrcamentos;
                  }}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                />
                <TextInput
                  name="frete"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor do frete"}
                  isNumber={true}
                  objectToCompare={initialOrcamentos}
                  setDirtyFields={setDirtyOrcamentoFields}
                  onChangeExtra={(newOrcamentos, index, value) => {
                    newOrcamentos[index].valorTotal =
                      Number(newOrcamentos[index].quantidade) *
                        Number(newOrcamentos[index].valorUnitario) +
                      Number(value);
                    return newOrcamentos;
                  }}
                  warnings={warningsOrcamentos}
                  handleTogglingModal={handleTogglingModal}
                />
                <TextInput
                  name="valorTotal"
                  object={orcamentos}
                  setObject={setOrcamentos}
                  index={current - 1}
                  label={"Valor total"}
                  isNumber={true}
                  disabled={true}
                  warnings={Array(orcamentos.length)} //temporario
                  handleTogglingModal={handleTogglingModal}
                />
              </div>
            </div>
            <div className={style.cpfPesquisadorCheckbox}>
              <CheckBoxInput
                name="isOrcadoComCpfCoordenador"
                object={orcamentos}
                setObject={setOrcamentos}
                index={current - 1}
                label={"Or??ado com o CPF do coordenador"}
                objectToCompare={initialOrcamentos}
                setDirtyFields={setDirtyOrcamentoFields}
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
      <div className={style.mainContentHeader}>
        <h3>Justificativa</h3>
      </div>
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
      if (blob) setBlob(); //?? setado no useEffect caso nao haja outro blob ja setado
    } else {
      const newFiles = [...anexos];
      const newObject = JSON.parse(JSON.stringify(item));

      newFiles[index] = file;
      newObject[index].actionAnexo = "post";

      setAnexos(newFiles);
      setItem(newObject);
      if (blob) setBlob(); //?? setado no useEffect caso nao haja outro blob ja setado
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
        fileBufferAxios
          .get(`/orcamento/${item[index].id}/file`)
          .then((response) => {
            const mime = response.headers["content-type"];
            const data = response.data;
            const blob = new Blob([data], {
              type: mime,
            });
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
        fileBufferAxios.get(url).then((response) => {
          const mime = response.headers["content-type"];
          const data = response.data;
          const blob = new Blob([data], {
            type: mime,
          });
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

  const [modalTiposOrcamento, setModalTiposOrcamento] = useState(true);

  return (
    <div
      className={style.anexoRiseUpMenuContent}
      style={!isAnexoOpen ? { display: "none" } : {}}
    >
      {hasId ? (
        <>
          {isFetching && <Loading />}
          {/* Modal informa????es sobre os tipos de or??amentos */}
          {modalTiposOrcamento === false && (
            <div
              className={style.modalTiposOrcamento}
              onClick={() => {
                setModalTiposOrcamento(true);
              }}
            >
              <div
                className={style.contentFormTiposOrcamento}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <h2>Tipos de or??amento</h2>
                <p>
                  Os or??amentos que n??o se enquadram em nenhum dos casos abaixo
                  t??m validade de 180 dias e dever??o ter data igual ou anterior
                  ?? compra, devendo constar: nome e CPF do(a) coordenador(a) do
                  programa ou projeto, objeto, quantitativo, valores em reais j??
                  inclu??dos todos os custos do fornecedor (fretes, impostos,
                  carga e descarga), Raz??o Social, CNPJ, data, validade,
                  telefone de contato e/ou e-mail e/ou site, nome e assinatura
                  do respons??vel e carimbo.
                </p>
                <p>
                  Nos casos de or??amentos recebidos por <strong>e-mail</strong>,
                  dispensa-se carimbo e assinatura, devendo ser enviada c??pia do
                  e-mail junto ao or??amento.
                </p>
                <p>
                  Nos casos de or??amentos da <strong>internet</strong>, ??
                  necess??rio realizar uma captura de tela em que apare??a:
                  objeto, quantitativo, valores em reais, data e hora, frete (se
                  houver), CNPJ, identifica????o da empresa e link do site.
                </p>
                <p>
                  Nos casos de or??amentos em{" "}
                  <strong>plataformas de vendas (marketplace)</strong> ??
                  necess??rio informar o CNPJ da empresa vendedora do produto.
                </p>
              </div>
            </div>
          )}
          <div>
            {index !== null && (
              <div
                className={style.tiposOrcamento}
                title="Informa????es sobre o que deve conter cada tipo de or??amento poss??vel"
                onClick={() => {
                  setModalTiposOrcamento(false);
                }}
              >
                ?
              </div>
            )}
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
            "n??o anexado"
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
        "Salve o or??amento antes de anexar"
      )}
    </div>
  );
}

export {
  ContentInformacoes,
  ContentOrcamentos,
  ContentJustificativa,
  MainContent,
  AnexoContent,
  AnexoRiseUpMenu,
};
