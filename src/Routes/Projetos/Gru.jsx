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
    setWasHovered(true);
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
        GRU - GRU - Guia de Recolhimento da União{" "}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <p>{hasChanges && "Há alterações não salvas "}</p>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
          >
            <svg
              style={{ fill: "#ca302d", transform: "translateY(0.1rem)" }}
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
        </div>
      </h1>
      <div className={style.mainContentGru}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={style.divTopCusteio}>
            <label htmlFor="valorGruCusteio">
              <p>Valor devolvido custeio:</p>
              <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                (Valor restante:{" "}
                {valorRestante.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                )
              </p>
            </label>
            {!gru.valorTotal && <div className={style.svgInputGru}>!</div>}
            <input
              style={!gru.valorTotal ? { border: "0.2rem solid #ffea00" } : {}}
              type="number"
              name="valorGru"
              id="valorGruCusteio"
              placeholder="Digite o valor aqui"
              value={gru.valorTotal || ""}
              onChange={(e) =>
                setGru((oldGru) => ({ ...oldGru, valorTotal: e.target.value }))
              }
            />
          </div>

          <div className={style.containerGruCusteio}>
            {gruBlobURL ? (
              <a href={gruBlobURL} target="_blank" rel="noreferrer">
                <p
                  style={{
                    padding: "0.47rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Visualizar GRU
                </p>
              </a>
            ) : wasHovered ? (
              <p style={{ display: "flex", justifyContent: "center" }}>
                <svg
                  style={{ transform: "translateY(-0.2rem)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path
                    d="M4.47 19h15.06L12 5.99 4.47 19zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    opacity="1"
                    fill="#ffea00"
                  />
                  <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>{" "}
                GRU não anexada
              </p>
            ) : (
              <p>...</p>
            )}
            <div>
              <button onClick={desanexarGru} disabled={!blobGru}>
                Desanexar
              </button>
              <label htmlFor="anexarGruCusteio">
                <p>Anexar GRU</p>
              </label>
              <input
                type="file"
                name="anexarGru"
                id="anexarGruCusteio"
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
                <p>Download</p>
              </a>
            </div>
          </div>

          {}

          <div className={style.containerComprovanteCusteio}>
            {comprovanteBlobURL ? (
              <a href={comprovanteBlobURL} target="_blank" rel="noreferrer">
                <p
                  style={{
                    padding: "0.47rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Visualizar Comprovante
                </p>
              </a>
            ) : wasHovered ? (
              <p style={{ display: "flex", justifyContent: "center" }}>
                <svg
                  style={{ transform: "translateY(-0.2rem)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path
                    d="M4.47 19h15.06L12 5.99 4.47 19zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    opacity="1"
                    fill="#ffea00"
                  />
                  <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>{" "}
                Comprovante não anexado
              </p>
            ) : (
              <p>...</p>
            )}
            <div>
              <button
                onClick={desanexarComprovante}
                disabled={!blobComprovante}
              >
                Desanexar
              </button>
              <label htmlFor="slaCusteio">
                <p>
                  Anexar <br /> Comprovante
                </p>
              </label>
              <input
                onChange={handleComprovanteChange}
                type="file"
                name="anexarGru"
                id="slaCusteio"
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
                <p>Download</p>
              </a>
            </div>
          </div>

          <div
            className={style.separar}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "100%",
                backgroundColor: "#6930c3",
              }}
            ></div>
            <div
              style={{
                height: "0px",
                width: "100%",
                border: "1px dashed black",
              }}
            ></div>
            <div></div>
          </div>

          <div className={style.divTopCapital}>
            <label htmlFor="valorGruCapital">
              <p>Valor devolvido capital:</p>
              <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                (Valor restante:{" "}
                {valorRestante.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                )
              </p>
            </label>
            {!gru.valorTotal && <div className={style.svgInputGru}>!</div>}
            <input
              style={!gru.valorTotal ? { border: "0.2rem solid #ffea00" } : {}}
              type="number"
              name="valorGru"
              id="valorGruCapital"
              placeholder="Digite o valor aqui"
              value={gru.valorTotal || ""}
              onChange={(e) =>
                setGru((oldGru) => ({ ...oldGru, valorTotal: e.target.value }))
              }
            />
          </div>
          <div className={style.containerGruCapital}>
            {gruBlobURL ? (
              <a href={gruBlobURL} target="_blank" rel="noreferrer">
                <p
                  style={{
                    padding: "0.47rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Visualizar GRU
                </p>
              </a>
            ) : wasHovered ? (
              <p style={{ display: "flex", justifyContent: "center" }}>
                <svg
                  style={{ transform: "translateY(-0.2rem)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path
                    d="M4.47 19h15.06L12 5.99 4.47 19zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    opacity="1"
                    fill="#ffea00"
                  />
                  <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>{" "}
                GRU não anexada
              </p>
            ) : (
              <p>...</p>
            )}
            <div>
              <button onClick={desanexarGru} disabled={!blobGru}>
                Desanexar
              </button>
              <label htmlFor="anexarGruCapital">
                <p>Anexar GRU</p>
              </label>
              <input
                type="file"
                name="anexarGru"
                id="anexarGruCapital"
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
                <p>Download</p>
              </a>
            </div>
          </div>
          <div className={style.containerComprovanteCapital}>
            {comprovanteBlobURL ? (
              <a href={comprovanteBlobURL} target="_blank" rel="noreferrer">
                <p
                  style={{
                    padding: "0.47rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Visualizar Comprovante
                </p>
              </a>
            ) : wasHovered ? (
              <p style={{ display: "flex", justifyContent: "center" }}>
                <svg
                  style={{ transform: "translateY(-0.2rem)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path
                    d="M4.47 19h15.06L12 5.99 4.47 19zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    opacity="1"
                    fill="#ffea00"
                  />
                  <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47zM11 16h2v2h-2zm0-6h2v4h-2z" />
                </svg>{" "}
                Comprovante não anexado
              </p>
            ) : (
              <p>...</p>
            )}
            <div>
              <button
                onClick={desanexarComprovante}
                disabled={!blobComprovante}
              >
                Desanexar
              </button>
              <label htmlFor="slaCapital">
                <p>
                  Anexar <br /> Comprovante
                </p>
              </label>
              <input
                onChange={handleComprovanteChange}
                type="file"
                name="anexarGru"
                id="slaCapital"
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
                <p>Download</p>
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
