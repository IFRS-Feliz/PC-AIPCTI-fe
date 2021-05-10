import axios from "../../axios";
import { useEffect, useState, useRef } from "react";
import { getProjectArrays } from "../../Helpers/EditarAdicionarUsuario";
import style from "../../assets/css/components/notaFiscal.module.css";

export default function NotaFiscal({ itemInfo, itens, setItens, index }) {
  const [expandir, setExpandir] = useState(style.anexarNotaFiscal);

  function setarClasse() {
    if (expandir === style.anexarNotaFiscal) {
      setExpandir(style.anexarNotaFiscalExpandir);
    } else {
      setExpandir(style.anexarNotaFiscal);
    }
  }

  const [containerContent, setContainerContent] = useState(null); //nota, orcamento ou null

  //estados dos dados
  const [itemNewInfo, setItemNewInfo] = useState(itemInfo);

  //estados dos orcamentos
  const [initialOrcamentos, setInitialOrcamentos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);

  const [currentOrcamentoForm, setCurrentOrcamentoForm] = useState(0);

  const divOrcamento = useRef();

  useEffect(() => {
    if (itemInfo.id) {
      axios
        .get(`/orcamento?idItem=${itemInfo.id}`)
        .then((response) => {
          setOrcamentos(response.data.results);
          setInitialOrcamentos(response.data.results);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [itemInfo.id]);

  function handleDeleteItem() {
    //somento caso seja um item ja registrado no banco
    if (itemInfo.id) {
      axios
        .delete("/item", { data: { itens: [itemInfo] } })
        .then(() => {
          updateItens();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      updateItens();
    }

    function updateItens() {
      const newItens = [...itens];
      newItens.splice(index, 1);
      setItens(newItens);
    }
  }

  function handleDeleteOrcamento(index) {
    const newOrcamentos = [...orcamentos];
    newOrcamentos.splice(index, 1);

    if (newOrcamentos.length < 1 || index === currentOrcamentoForm - 1) {
      setCurrentOrcamentoForm(0);
    }

    setOrcamentos(newOrcamentos);
  }

  function animacao() {
    if (containerContent === "nota") {
      return "36.45rem";
    } else if (containerContent === "orcamento" && currentOrcamentoForm === 0) {
      return "18.1875rem";
    } else if (containerContent === "orcamento" && currentOrcamentoForm > 0) {
      return "35.5rem";
    }
  }

  async function handleSaveItem() {
    itemNewInfo.despesa =
      itemNewInfo.tipo === "materialPermanente" ? "capital" : "custeio";

    const idItem = await handleItem();
    handleOrcamentos(idItem || itemNewInfo.id);

    async function handleOrcamentos(idItem) {
      //pegar listas de orcamentos
      const { addedProjects, updatedProjects, deletedProjects } =
        getProjectArrays(initialOrcamentos, orcamentos);

      try {
        if (deletedProjects.length > 0) {
          console.log("estou querendo deletar");
          await axios.delete("/orcamento", {
            data: { orcamentos: deletedProjects },
          });
        }

        if (addedProjects.length > 0) {
          addedProjects.forEach((orcamento) => (orcamento.idItem = idItem));
          await axios.post("/orcamento", { orcamentos: addedProjects });
        }

        if (updatedProjects.length > 0) {
          await axios.put("/orcamento", { orcamentos: updatedProjects });
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function handleItem() {
      try {
        if (itemNewInfo.id) {
          axios.put("/item", { itens: [itemNewInfo] });
          return itemNewInfo.id;
        }
        const response = await axios.post("/item", { itens: [itemNewInfo] });
        setItemNewInfo({ ...itemNewInfo, id: response.data.results[0].id });
        return response.data.results[0].id;
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div className={style.container}>
      <div
        className={
          containerContent
            ? style.containerNotaFiscalInicial
            : style.containerNotaFiscalFinal
        }
        style={{ height: animacao() }}
      >
        <div className={style.divTopo}>
          <span>
            <p>{itemNewInfo.nomeMaterialServico || "Novo item"}</p>
          </span>
          <div className={style.containerBotao}>
            <button
              className={
                containerContent === "nota"
                  ? style.buttonDocumentoFiscalTarget
                  : style.buttonDocumentoFiscal
              }
              onClick={() => {
                if (containerContent === "nota") setContainerContent(null);
                else setContainerContent("nota");
              }}
            >
              Dados
            </button>
            <button
              className={
                containerContent === "orcamento"
                  ? style.buttonOrcamentoTarget
                  : style.buttonOrcamento
              }
              onClick={() => {
                if (containerContent === "orcamento") setContainerContent(null);
                else setContainerContent("orcamento");
              }}
            >
              Orçamentos
            </button>
          </div>
        </div>
        {containerContent === "nota" ? (
          <>
            <div className={style.containerContentHeader}>
              <h1>Dados</h1>
              <div>
                <input type="checkbox" id="comCpfCoordenador" />
                <label htmlFor="comCpfCoordenador">
                  Esse item foi comprado com o CPF do coordenador do projeto.
                </label>
              </div>
            </div>
            <form
              className={style.flexBox}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={style.containerInputs}>
                <div className={style.row}>
                  <label htmlFor="nome">Descrição:</label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    className={style.inputRelatorio}
                    value={itemNewInfo.descricao}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        descricao: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="tipoProduto">Tipo: </label>
                  <select
                    name="tipoProduto"
                    id="tipoProduto"
                    className={style.inputRelatorio}
                    value={itemNewInfo.tipo}
                    onChange={(e) =>
                      setItemNewInfo({ ...itemNewInfo, tipo: e.target.value })
                    }
                  >
                    <option value="materialConsumo">Material de consumo</option>
                    <option value="materialPermanente">
                      Material permanente
                    </option>
                    <option value="servicoPessoaFisica">
                      Serviço de terceiros (pessoa física)
                    </option>
                    <option value="servicoPessoaJuridica">
                      Serviço de terceiros (pessoa jurídica)
                    </option>
                    <option value="hospedagem">Hospedagem</option>
                    <option value="passagem">Passagem</option>
                    <option value="alimentacao">
                      Alimentação de estudantes
                    </option>
                  </select>
                </div>
                <p className={style.detalhamentoRelatorio}>Detalhamento</p>
                <div className={style.row}>
                  <label htmlFor="nomeMaterial">
                    Nome do material / serviço:
                  </label>
                  <input
                    type="text"
                    name="nomeMaterial"
                    id="nomeMaterial"
                    className={style.inputRelatorio}
                    value={itemNewInfo.nomeMaterialServico}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        nomeMaterialServico: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="marca">Marca:</label>
                  <input
                    type="text"
                    name="marca"
                    id="marca"
                    className={style.inputRelatorio}
                    value={itemNewInfo.marca}
                    onChange={(e) =>
                      setItemNewInfo({ ...itemNewInfo, marca: e.target.value })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="modelo">Modelo:</label>
                  <input
                    type="text"
                    name="modelo"
                    id="modelo"
                    className={style.inputRelatorio}
                    value={itemNewInfo.modelo}
                    onChange={(e) =>
                      setItemNewInfo({ ...itemNewInfo, modelo: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className={style.containerInputs}>
                <div className={style.row}>
                  <label htmlFor="dataCompra">
                    Data da compra / contratação:
                  </label>
                  <input
                    type="date"
                    name="dataCompra"
                    id="dataCompra"
                    className={style.inputRelatorio}
                    value={itemNewInfo.dataCompraContratacao}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        dataCompraContratacao: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="favorecido">Favorecido:</label>
                  <input
                    type="text"
                    name="favorecido"
                    id="favorecido"
                    className={style.inputRelatorio}
                    value={itemNewInfo.cnpjFavorecido}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        cnpjFavorecido: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="quantidade">Quantidade:</label>
                  <input
                    type="number"
                    name="quantidade"
                    id="quantidade"
                    className={style.inputRelatorio}
                    value={itemNewInfo.quantidade}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        quantidade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="valorUnitario">Valor unitário:</label>
                  <input
                    type="number"
                    name="valorUnitario"
                    id="valorUnitario"
                    className={style.inputRelatorio}
                    value={itemNewInfo.valorUnitario}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        valorUnitario: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="frete">Valor do frete:</label>
                  <input
                    type="number"
                    name="frete"
                    id="frete"
                    className={style.inputRelatorio}
                    value={itemNewInfo.frete}
                    onChange={(e) =>
                      setItemNewInfo({ ...itemNewInfo, frete: e.target.value })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="valorTotal">Valor total:</label>
                  <input
                    type="number"
                    name="valorTotal"
                    id="valorTotal"
                    className={style.inputRelatorio}
                    value={itemNewInfo.valorTotal}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        valorTotal: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.row}>
                  <label htmlFor="numDocumentoFiscal">
                    Nº do documento fiscal:
                  </label>
                  <input
                    type="number"
                    name="numDocumentoFiscal"
                    id="numDocumentoFiscal"
                    className={style.inputRelatorio}
                    value={itemNewInfo.numeroDocumentoFiscal}
                    onChange={(e) =>
                      setItemNewInfo({
                        ...itemNewInfo,
                        numeroDocumentoFiscal: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className={style.containerAnexarNotaFiscal}>
                <div
                  className={expandir}
                  onClick={(e) => {
                    if (
                      expandir === e.target.className ||
                      e.target.className === style.pAnexarNotaFiscal
                    ) {
                      setarClasse();
                    }
                  }}
                >
                  <p className={style.pAnexarNotaFiscal}>
                    Anexar documento fiscal
                  </p>
                  <div className={style.notaFiscal}>
                    <p>Selecione uma nota fiscal</p>
                    <label
                      htmlFor="anexarNota"
                      className={style.labelInputFile}
                    >
                      Clique aqui
                    </label>
                    <input
                      type="file"
                      name="anexarNota"
                      id="anexarNota"
                      className={style.inputFile}
                    />
                    <p className={style.separarAnexarNota}>
                      ______________ OU ______________
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </>
        ) : (
          ""
        )}

        {containerContent === "orcamento" ? (
          <>
            <div className={style.containerContentHeader}>
              <h1>
                {currentOrcamentoForm > 0
                  ? `Orçamento ${currentOrcamentoForm}`
                  : "Orçamentos"}
              </h1>
              <p>Utilizar uma justificativa</p>
            </div>

            <div
              className={style.agruparBotoesOrcamento}
              ref={divOrcamento}
              style={currentOrcamentoForm === 0 ? { marginBottom: "2rem" } : {}}
            >
              {orcamentos.map((orcamento, index) => (
                <div key={index}>
                  <button
                    onClick={() => {
                      if (currentOrcamentoForm === index + 1)
                        setCurrentOrcamentoForm(0);
                      else setCurrentOrcamentoForm(index + 1);
                    }}
                    className={
                      currentOrcamentoForm === index + 1
                        ? `${style.botaoOrcamentoTarget} ${style.botaoOrcamneto}`
                        : style.botaoOrcamneto
                    }
                  >
                    <p>
                      Orçamento <br /> {index + 1}
                    </p>
                  </button>
                  <button
                    className={style.apagarOrcamento}
                    onClick={(e) => handleDeleteOrcamento(index)}
                  >
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
              ))}
              <button
                className={style.rightArrow}
                onClick={() => {
                  divOrcamento.current.scrollBy(300, 0);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <g>
                    <path d="M0,0h24v24H0V0z" fill="none" />
                  </g>
                  <g>
                    <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
                  </g>
                </svg>
              </button>
              <button
                className={style.leftArrow}
                onClick={() => {
                  divOrcamento.current.scrollBy(-300, 0);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <g>
                    <path d="M0,0h24v24H0V0z" fill="none" />
                  </g>
                  <g>
                    <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
                  </g>
                </svg>
              </button>
              <button
                className={style.adicionarOrcamento}
                onClick={() => {
                  setOrcamentos([...orcamentos, defaultOrcamento]);
                }}
              >
                +
              </button>
            </div>
            {currentOrcamentoForm > 0 && (
              <FormOrcamento
                expandir={expandir}
                setarClasse={setarClasse}
                setContainerContent={setContainerContent}
                orcamentos={orcamentos}
                setOrcamentos={setOrcamentos}
                currentOrcamentoForm={currentOrcamentoForm}
                handleDeleteOrcamento={handleDeleteOrcamento}
              />
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className={style.utils}>
        <button onClick={handleSaveItem}>Salvar</button>
        <button onClick={handleDeleteItem}>Deletar</button>
      </div>
    </div>
  );
}

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
};

function FormOrcamento({
  expandir,
  setarClasse,
  setContainerContent,
  orcamentos,
  setOrcamentos,
  currentOrcamentoForm,
  handleDeleteOrcamento,
}) {
  return (
    <form
      className={style.flexBox}
      style={{
        backgroundColor: "#E5E9EC",
        borderTopLeftRadius: "3rem",
        borderTopRightRadius: "3rem",
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className={style.containerInputs}>
        <div className={style.row}>
          <label htmlFor="dataCompra">Data do orçamento:</label>
          <input
            type="date"
            name="dataOrcamento"
            id="dataOrcamento"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].dataOrcamento}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].dataOrcamento =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <p className={style.detalhamentoRelatorio}>Detalhamento</p>
        <div className={style.row}>
          <label htmlFor="nomeMaterial">Nome do material / serviço:</label>
          <input
            type="text"
            name="nomeMaterial"
            id="nomeMaterial"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].nomeMaterialServico}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].nomeMaterialServico =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            name="marca"
            id="marca"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].marca}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].marca = e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            name="modelo"
            id="modelo"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].modelo}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].modelo = e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
      </div>

      <div className={style.containerInputs}>
        <div className={style.row}>
          <label htmlFor="favorecido">Favorecido:</label>
          <input
            type="text"
            name="favorecido"
            id="favorecido"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].cnpjFavorecido}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].cnpjFavorecido =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>

        <div className={style.row}>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            id="quantidade"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].quantidade}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].quantidade =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="valorUnitario">Valor unitário:</label>
          <input
            type="number"
            name="valorUnitario"
            id="valorUnitario"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].valorUnitario}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].valorUnitario =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="frete">Valor do frete:</label>
          <input
            type="number"
            name="frete"
            id="frete"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].frete}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].frete = e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="valorTotal">Valor total:</label>
          <input
            type="number"
            name="valorTotal"
            id="valorTotal"
            className={style.inputRelatorio}
            value={orcamentos[currentOrcamentoForm - 1].valorTotal}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].valorTotal =
                e.target.value;
              setOrcamentos(newOrcamentos);
            }}
          />
        </div>
      </div>
      <div className={style.containerAnexarNotaFiscal}>
        <div
          className={expandir}
          onClick={(e) => {
            if (
              expandir === e.target.className ||
              e.target.className === style.pAnexarNotaFiscal
            ) {
              setarClasse();
            }
          }}
        >
          <p className={style.pAnexarNotaFiscal}>Anexar Orçamento</p>
          <div className={style.notaFiscal}>
            <p>Selecione um orçamento</p>
            <label htmlFor="anexarNota" className={style.labelInputFile}>
              Clique aqui
            </label>
            <input
              type="file"
              name="anexarNota"
              id="anexarNota"
              className={style.inputFile}
              // value={orcamentos[currentOrcamentoForm-1].anexo}
            />
            <p className={style.separarAnexarNota}>
              ______________ OU ______________
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
