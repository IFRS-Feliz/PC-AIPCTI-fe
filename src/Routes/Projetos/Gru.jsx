import { useState } from "react";
import { useEffect } from "react";
import style from "../../assets/css/routes/relatorio.module.css";
import axios from "../../axios";
import Loading from "../../Components/Loading";

export default function Gru({ idProjeto, valorRestante, setTotalDevolvido }) {
  const [gru, setGru] = useState({ idProjeto: idProjeto, valorTotal: 0 });
  const [valorTotalInicial, setValorTotalInicial] = useState(0);

  const [blobGru, setBlobGru] = useState();
  const [blobComprovante, setBlobComprovante] = useState();

  const [isFetching, setIsFetching] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);

  useEffect(() => {
    axios
      .get(`/projeto/${idProjeto}/gru`)
      .then((response) => {
        if (!response.data.results.length) return;
        setGru({ ...response.data.results[0], idProjeto: idProjeto });
        const { valorTotal } = response.data.results[0];
        setValorTotalInicial(valorTotal);
      })
      .catch((e) => console.log(e));
  }, [idProjeto]);

  function handleSave() {
    //caso o gru nao exista no banco, cria-lo antes de enviar arquivos
    if (gru.id === undefined) {
      (async () => {
        await axios
          .post(`/projeto/${idProjeto}/gru`, { gru })
          .then((response) => {
            const gru = response.data.results[0];
            setGru(gru);
            setValorTotalInicial(gru.valorTotal);
          })
          .catch((e) => console.log(e));

        updateFiles();
      })();
      return;
    }

    //caso o gru ja exista no banco, atualizar e enviar arquivos
    const { id, valorTotal } = gru;
    axios
      .put(`/projeto/${idProjeto}/gru`, { gru: { id, valorTotal } })
      .then(() => {
        setValorTotalInicial(gru.valorTotal);
      })
      .catch((e) => console.log(e));

    updateFiles();

    function updateFiles() {
      //actionAnexo de ambos podem ser post ou delete

      //arquivo da gru
      if (gru.actionAnexoGru === "post") {
        let formDataGru = new FormData();
        formDataGru.append("file", blobGru);
        axios
          .post(`projeto/${idProjeto}/gru/file?type=pathAnexoGru`, formDataGru)
          .then(() => {
            //atualizar informacoes locais apos o envio
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGru: true,
              actionAnexoGru: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoGru === "delete") {
        axios
          .delete(`projeto/${idProjeto}/gru/file?type=pathAnexoGru`)
          .then(() => {
            setBlobGru();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGru: undefined,
              actionAnexoGru: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }

      //arquivo do comprovante
      if (gru.actionAnexoComprovante === "post") {
        let formDataComprovante = new FormData();
        formDataComprovante.append("file", blobComprovante);
        axios
          .post(
            `projeto/${idProjeto}/gru/file?type=pathAnexoComprovante`,
            formDataComprovante
          )
          .then(() => {
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovante: true,
              actionAnexoComprovante: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoComprovante === "delete") {
        axios
          .delete(`projeto/${idProjeto}/gru/file?type=pathAnexoComprovante`)
          .then(() => {
            setBlobComprovante();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovante: undefined,
              actionAnexoComprovante: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }
    }
  }

  function handleGruChange(e) {
    let file = e.target.files[0];

    if (!file) {
      desanexarGru();
      return;
    }

    file.ext = getFileExtension(file.type);

    setBlobGru(file);

    setGru((oldGru) => ({ ...oldGru, actionAnexoGru: "post" }));
  }

  function handleComprovanteChange(e) {
    let file = e.target.files[0];

    if (!file) {
      desanexarComprovante();
      return;
    }

    file.ext = getFileExtension(file.type);

    setBlobComprovante(file);

    setGru((oldGru) => ({ ...oldGru, actionAnexoComprovante: "post" }));
  }

  function desanexarGru() {
    setBlobGru();
    setGru((oldGru) => ({
      ...oldGru,
      actionAnexoGru: gru.pathAnexoGru ? "delete" : undefined,
    }));
  }

  function desanexarComprovante() {
    setBlobComprovante();
    setGru((oldGru) => ({
      ...oldGru,
      actionAnexoComprovante: gru.pathAnexoComprovante ? "delete" : undefined,
    }));
  }

  //sincronizar valorTotalInicial com o valorDevolvido do componente pai
  useEffect(() => {
    setTotalDevolvido(valorTotalInicial);
  }, [valorTotalInicial, setTotalDevolvido]);

  //baixar arquivos inicialmente on mouse over
  function handleMouseOver() {
    if (gru.id === undefined) return;

    setIsFetching(true);
    let actions = [];
    //caso haja um arquivo da gru e ele ja nao tenha sido baixado
    if (gru.pathAnexoGru && !blobGru && !gru.actionAnexoGru) {
      actions.push(
        axios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoGru`)
          .then((response) => {
            const mime = response.data.fileMime;
            const array = [new Uint8Array(response.data.file.data)];
            const blob = new Blob(array, { type: mime });
            blob.ext = getFileExtension(blob.type);

            setBlobGru(blob);
          })
          .catch((e) => console.log(e))
      );
    }
    //mesma logica para o comprovante
    if (
      gru.pathAnexoComprovante &&
      !blobComprovante &&
      !gru.actionAnexoComprovante
    ) {
      actions.push(
        axios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoComprovante`)
          .then((response) => {
            const mime = response.data.fileMime;
            const array = [new Uint8Array(response.data.file.data)];
            const blob = new Blob(array, { type: mime });
            blob.ext = getFileExtension(blob.type);

            setBlobComprovante(blob);
          })
          .catch((e) => console.log(e))
      );
    }

    //apos baixar os arquivos, remover spinner de loading
    Promise.all(actions).finally(() => {
      setIsFetching(false);
      setWasHovered(true);
    });
  }

  const gruBlobURL = blobGru ? URL.createObjectURL(blobGru) : "";
  const comprovanteBlobURL = blobComprovante
    ? URL.createObjectURL(blobComprovante)
    : "";

  const hasChanges =
    Number(gru.valorTotal) !== Number(valorTotalInicial) ||
    gru.actionAnexoComprovante ||
    gru.actionAnexoGru;

  return (
    <div onMouseEnter={handleMouseOver} style={{ position: "relative" }}>
      {isFetching && <Loading />}
      <h1
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        GRU - Guia de Recolhimento da União{" "}
        <div style={{ display: "flex", gap: "1rem" }}>
          <p>{hasChanges && "Há alterações não salvas "}</p>
          <button onClick={handleSave} disabled={!hasChanges}>
            Salvar
          </button>
        </div>
      </h1>
      <div className={style.mainContentGru}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={style.divTop}>
            <label htmlFor="valorGru">
              <p>Valor devolvido:</p>
              <p style={{ fontSize: "0.8rem" }}>
                (Valor restante:{" "}
                {valorRestante.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                )
              </p>
            </label>
            {!gru.valorTotal && "SVG warning"}
            <input
              type="number"
              name="valorGru"
              id="valorGru"
              placeholder="Digite o valor aqui"
              value={gru.valorTotal || ""}
              onChange={(e) =>
                setGru((oldGru) => ({ ...oldGru, valorTotal: e.target.value }))
              }
            />
          </div>
          <div className={style.divBottom}>
            {gruBlobURL ? (
              <a href={gruBlobURL} target="_blank" rel="noreferrer">
                <p>Visualizar GRU</p>
              </a>
            ) : wasHovered ? (
              <p>SVG warning GRU não anexada</p>
            ) : (
              <p>...</p>
            )}
            {comprovanteBlobURL ? (
              <a href={comprovanteBlobURL} target="_blank" rel="noreferrer">
                <p>Visualizar Comprovante</p>
              </a>
            ) : wasHovered ? (
              <p>SVG warning Comprovante não anexado</p>
            ) : (
              <p>...</p>
            )}

            <div style={{ display: "flex", height: "100%" }}>
              <button onClick={desanexarGru} disabled={!blobGru}>
                Desanexar
              </button>
              <label htmlFor="anexarGru">
                <p>Anexar GRU</p>
              </label>
              <input
                type="file"
                name="anexarGru"
                id="anexarGru"
                onChange={handleGruChange}
                hidden
              />
              <a
                download={gruBlobURL ? "anexo." + blobGru.ext : "anexo"}
                href={gruBlobURL}
                style={
                  !gruBlobURL ? { pointerEvents: "none", opacity: "50%" } : {}
                }
              >
                Download
              </a>

              {}

              <button
                onClick={desanexarComprovante}
                disabled={!blobComprovante}
              >
                Desanexar
              </button>
              <label htmlFor="sla">
                <p>Anexar Comprovante</p>
              </label>
              <input
                onChange={handleComprovanteChange}
                type="file"
                name="anexarGru"
                id="sla"
                hidden
              />
              <a
                download={
                  comprovanteBlobURL ? "anexo." + blobComprovante.ext : "anexo"
                }
                href={comprovanteBlobURL}
                style={
                  !comprovanteBlobURL
                    ? { pointerEvents: "none", opacity: "50%" }
                    : {}
                }
              >
                Download
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
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
