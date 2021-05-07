import { useRef, useState } from "react";
import style from "../../assets/css/components/notaFiscal.module.css";

export default function NotaFiscal({ itemInfo }) {
  const [expandir, setExpandir] = useState(style.anexarNotaFiscal);

  function setarClasse() {
    if (expandir === style.anexarNotaFiscal) {
      setExpandir(style.anexarNotaFiscalExpandir);
    } else {
      setExpandir(style.anexarNotaFiscal);
    }
  }

  const [containerContent, setContainerContent] = useState(null); //nota, orcamento ou null

  const [orcamentos, setOrcamentos] = useState([
    // defaultOrcamento,
    // defaultOrcamento,
    // defaultOrcamento,
  ]);

  const [currentOrcamentoForm, setCurrentOrcamentoForm] = useState(0);

  const divOrcamento = useRef();

  return (
    <>
      <div
        className={
          containerContent
            ? style.containerNotaFiscalInicial
            : style.containerNotaFiscalFinal
        }
      >
        <div className={style.divTopo}>
          <span>
            <p>Novo item</p>
          </span>
          <div className={style.containerBotao}>
            <button
              className={style.buttonDocumentoFiscal}
              onClick={() => {
                if (containerContent === "nota") setContainerContent(null);
                else setContainerContent("nota");
              }}
            >
              Dados
            </button>
            <button
              className={style.buttonOrcamento}
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
                  value={itemInfo.descricao}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="tipoProduto">Tipo: </label>
                <select
                  name="tipoProduto"
                  id="tipoProduto"
                  className={style.inputRelatorio}
                  value={itemInfo.tipo}
                >
                  <option value="material de consumo">
                    Material de consumo
                  </option>
                  <option value="material permanente">
                    Material permanente
                  </option>
                  <option value="serviços de terceiro (pessoa fisica)">
                    Serviços de terceiro (pessoa física)
                  </option>
                  <option value="serviços de terceiro (pessoa juridica)">
                    Serviços de terceiro (pessoa jurídica)
                  </option>
                  <option value="hospedagem">Hospedagem</option>
                  <option value="passagens">Passagens</option>
                  <option value="alimentacao de estudantes">
                    Alimentacao de estudantes
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
                  value={itemInfo.nome}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  name="marca"
                  id="marca"
                  className={style.inputRelatorio}
                  value={itemInfo.marca}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="modelo">Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  id="modelo"
                  className={style.inputRelatorio}
                  value={itemInfo.modelo}
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
                  value={itemInfo.data}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="favorecido">Favorecido:</label>
                <input
                  type="text"
                  name="favorecido"
                  id="favorecido"
                  className={style.inputRelatorio}
                  value={itemInfo.favorecido}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="quantidade">Quantidade:</label>
                <input
                  type="number"
                  name="quantidade"
                  id="quantidade"
                  className={style.inputRelatorio}
                  value={itemInfo.quantidade}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="valorUnitario">Valor unitário:</label>
                <input
                  type="number"
                  name="valorUnitario"
                  id="valorUnitario"
                  className={style.inputRelatorio}
                  value={itemInfo.valorUnitario}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="frete">Valor do frete:</label>
                <input
                  type="number"
                  name="frete"
                  id="frete"
                  className={style.inputRelatorio}
                  value={itemInfo.frete}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="valorTotal">Valor total:</label>
                <input
                  type="number"
                  name="valorTotal"
                  id="valorTotal"
                  className={style.inputRelatorio}
                  value={itemInfo.valorTotal}
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
                  value={itemInfo.numeroDocumentoFiscal}
                />
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

              <button
                className={style.botaoSalvarNotaFiscal}
                onClick={() => {
                  setContainerContent(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          ""
        )}

        {containerContent === "orcamento" ? (
          <>
            <div
              className={style.agruparBotoesOrcamento}
              ref={divOrcamento}
              style={currentOrcamentoForm === 0 ? { marginBottom: "2rem" } : {}}
            >
              {orcamentos.map((orcamento, index) => (
                <button
                  key={index}
                  onClick={() => {
                    {
                      if (currentOrcamentoForm === index + 1)
                        setCurrentOrcamentoForm(0);
                      else setCurrentOrcamentoForm(index + 1);
                    }
                  }}
                  className={
                    currentOrcamentoForm === index + 1
                      ? style.botaoOrcamento
                      : {}
                  }
                >
                  {`Orçamento ${index + 1}`}
                </button>
              ))}
              <button
                className={style.rightArrow}
                onClick={() => {
                  divOrcamento.current.scrollBy(300, 0);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24"
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
                  enable-background="new 0 0 24 24"
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
              />
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

const defaultOrcamento = {
  nomeMaterialServico: "",
  marca: "",
  modelo: "",
  dataOrcamento: "",
  CnpjFavorecido: "",
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
}) {
  return (
    <form
      className={style.flexBox}
      style={{ backgroundColor: "#639163" }}
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
            value={orcamentos[currentOrcamentoForm - 1].CnpjFavorecido}
            onChange={(e) => {
              let newOrcamentos = [...orcamentos];
              newOrcamentos[currentOrcamentoForm - 1].CnpjFavorecido =
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

        <button
          className={style.botaoSalvarNotaFiscal}
          onClick={() => {
            setContainerContent(null);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
