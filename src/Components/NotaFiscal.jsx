import { useState } from "react";
import style from "../assets/css/components/notaFiscal.module.css";

export default function NotaFiscal() {
  const [expandir, setExpandir] = useState(style.anexarNotaFiscal);

  function setarClasse() {
    if (expandir === style.anexarNotaFiscal) {
      setExpandir(style.anexarNotaFiscalExpandir);
    } else {
      setExpandir(style.anexarNotaFiscal);
    }
  }

  return (
    <>
      <div className={style.containerNotaFiscal}>
        <span>
          <p>Nota Fiscal</p>
        </span>
        <form className={style.flexBox}>
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
            <div className={style.row}>
              <label htmlFor="tipoDespesa">Despesa de: </label>
              <select
                name="tipoDespesa"
                id="tipoDespesa"
                className={style.inputRelatorio}
              >
                <option value="custeio">Custeio</option>
                <option value="capital">Capital</option>
              </select>
            </div>
            <div className={style.row}>
              <label htmlFor="tipoProduto">Tipo: </label>
              <select
                name="tipoProduto"
                id="tipoProduto"
                className={style.inputRelatorio}
              >
                <option value="material de consumo">Material de consumo</option>
                <option value="material permanente">Material permanente</option>
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
              <label htmlFor="dataCompra">Data da compra / contratação:</label>
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
          </div>
        </form>
      </div>
    </>
  );
}
