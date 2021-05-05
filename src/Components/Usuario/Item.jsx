import { useState } from "react";
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

  const [orcamentos, setOrcamentos] = useState([{}, {}, {}]);

  const [currentOrcamentoForm, setCurrentOrcamentoForm] = useState(0);

  return (
    <>
      <div
        className={
          containerContent
            ? style.containerNotaFiscalInicial
            : style.containerNotaFiscalFinal
        }
      >
        <span>
          <p>Nome do item</p>
        </span>

        <div className={style.containerBotao}>
          <button
            onClick={() => {
              if (containerContent === "nota") setContainerContent(null);
              else setContainerContent("nota");
            }}
          >
            Visualizar
          </button>
          <button
            onClick={() => {
              if (containerContent === "orcamento") setContainerContent(null);
              else setContainerContent("orcamento");
            }}
          >
            Orcamentos
          </button>
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
                <label htmlFor="nome">Nome do item:</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  className={style.inputRelatorio}
                />
              </div>
              {/* <div className={style.row}>
              <label htmlFor="tipoDespesa">Despesa de: </label>
              <select
                name="tipoDespesa"
                id="tipoDespesa"
                className={style.inputRelatorio}
              >
                <option value="custeio">Custeio</option>
                <option value="capital">Capital</option>
              </select>
            </div> */}
              <div className={style.row}>
                <label htmlFor="tipoProduto">Tipo: </label>
                <select
                  name="tipoProduto"
                  id="tipoProduto"
                  className={style.inputRelatorio}
                  // value={itemInfo.tipo}
                  // onChange={(e) => setTipo(e.target.value)}
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
                />
              </div>
              <div className={style.row}>
                <label htmlFor="caracteristicas">Características:</label>
                <input
                  type="text"
                  name="caracteristicas"
                  id="caracteristicas"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  name="marca"
                  id="marca"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="modelo">Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  id="modelo"
                  className={style.inputRelatorio}
                />
              </div>
            </div>
            <div className={style.containerInputs}>
              <div className={style.row}>
                <label htmlFor="frete">Frete:</label>
                <input
                  type="number"
                  name="frete"
                  id="frete"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="dataCompra">
                  Data da compra / contratação:
                </label>
                <input
                  type="date"
                  name="dataCompra"
                  id="dataCompra"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="favorecido">Favorecido:</label>
                <input
                  type="text"
                  name="favorecido"
                  id="favorecido"
                  className={style.inputRelatorio}
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
                />
              </div>
              <div className={style.row}>
                <label htmlFor="quantidade">Quantidade:</label>
                <input
                  type="number"
                  name="quantidade"
                  id="quantidade"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="valorUnitario">Valor unitário:</label>
                <input
                  type="number"
                  name="valorUnitario"
                  id="valorUnitario"
                  className={style.inputRelatorio}
                />
              </div>
              <div className={style.row}>
                <label htmlFor="valorTotal">Valor total:</label>
                <input
                  type="number"
                  name="valorTotal"
                  id="valorTotal"
                  className={style.inputRelatorio}
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
                  <p className={style.pAnexarNotaFiscal}>Anexar nota fiscal</p>
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
            <div className={style.agruparBotoesOrcamento}>
              {orcamentos.map((orcamento, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (currentOrcamentoForm === index + 1)
                      setCurrentOrcamentoForm(0);
                    else setCurrentOrcamentoForm(index + 1);
                  }}
                >
                  {`Orçamento ${index + 1}`}
                </button>
              ))}
              <button
                onClick={() => setOrcamentos([...orcamentos, { nome: "" }])}
              >
                +
              </button>
            </div>
            {currentOrcamentoForm > 0 && (
              <FormOrcamento
                expandir={expandir}
                setarClasse={setarClasse}
                setContainerContent={setContainerContent}
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

function FormOrcamento({ expandir, setarClasse, setContainerContent }) {
  return (
    <form
      className={style.flexBox}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className={style.containerInputs}>
        <div className={style.row}>
          <label htmlFor="nomeMaterial">Nome do material / serviço:</label>
          <input
            type="text"
            name="nomeMaterial"
            id="nomeMaterial"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="caracteristicas">Características:</label>
          <input
            type="text"
            name="caracteristicas"
            id="caracteristicas"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            name="marca"
            id="marca"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            name="modelo"
            id="modelo"
            className={style.inputRelatorio}
          />
        </div>
      </div>

      <div className={style.containerInputs}>
        <div className={style.row}>
          <label htmlFor="frete">Frete:</label>
          <input
            type="number"
            name="frete"
            id="frete"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="dataCompra">Data do orçamento:</label>
          <input
            type="date"
            name="dataOrcamento"
            id="dataOrcamento"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="favorecido">Favorecido:</label>
          <input
            type="text"
            name="favorecido"
            id="favorecido"
            className={style.inputRelatorio}
          />
        </div>

        <div className={style.row}>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            id="quantidade"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="valorUnitario">Valor unitário:</label>
          <input
            type="number"
            name="valorUnitario"
            id="valorUnitario"
            className={style.inputRelatorio}
          />
        </div>
        <div className={style.row}>
          <label htmlFor="valorTotal">Valor total:</label>
          <input
            type="number"
            name="valorTotal"
            id="valorTotal"
            className={style.inputRelatorio}
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
