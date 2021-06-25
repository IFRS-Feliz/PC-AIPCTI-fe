import { useState } from "react";
import { useEffect } from "react";
import style from "../../assets/css/routes/relatorio.module.css";
import axios, { fileBufferAxios } from "../../axios";
import Loading from "../../Components/Loading";

export default function Gru({
  idProjeto,
  valorRestanteCusteio,
  valorRestanteCapital,
  setTotalDevolvido,
}) {
  const [gru, setGru] = useState({
    idProjeto: idProjeto,
    valorTotalCusteio: 0,
    valorTotalCapital: 0,
  });
  const [valorTotalInicialCusteio, setValorTotalInicialCusteio] = useState(0);
  const [valorTotalInicialCapital, setValorTotalInicialCapital] = useState(0);

  const [blobGruCusteio, setBlobGruCusteio] = useState();
  const [blobComprovanteCusteio, setBlobComprovanteCusteio] = useState();

  const [blobGruCapital, setBlobGruCapital] = useState();
  const [blobComprovanteCapital, setBlobComprovanteCapital] = useState();

  const [isFetching, setIsFetching] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);

  useEffect(() => {
    axios
      .get(`/projeto/${idProjeto}/gru`)
      .then((response) => {
        if (!response.data.results.length) return;
        setGru({ ...response.data.results[0], idProjeto: idProjeto });

        const { valorTotalCusteio } = response.data.results[0];
        const { valorTotalCapital } = response.data.results[0];
        setValorTotalInicialCusteio(valorTotalCusteio);
        setValorTotalInicialCapital(valorTotalCapital);
      })
      .catch((e) => console.log(e));
  }, [idProjeto]);

  console.log(gru);

  function handleSave() {
    //caso o gru nao exista no banco, cria-lo antes de enviar arquivos
    if (gru.id === undefined) {
      (async () => {
        await axios
          .post(`/projeto/${idProjeto}/gru`, { gru })
          .then((response) => {
            const gru = response.data.results[0];
            setGru(gru);
            setValorTotalInicialCusteio(gru.valorTotalCusteio);
            setValorTotalInicialCapital(gru.valorTotalCapital);
          })
          .catch((e) => console.log(e));

        updateFiles();
      })();
      return;
    }

    //caso o gru ja exista no banco, atualizar e enviar arquivos
    const { id, valorTotalCusteio, valorTotalCapital } = gru;
    axios
      .put(`/projeto/${idProjeto}/gru`, {
        gru: { id, valorTotalCusteio, valorTotalCapital },
      })
      .then(() => {
        setValorTotalInicialCusteio(gru.valorTotalCusteio);
        setValorTotalInicialCapital(gru.valorTotalCapital);
      })
      .catch((e) => console.log(e));

    updateFiles();

    function updateFiles() {
      //actionAnexo de ambos podem ser post ou delete

      //arquivo da gru Custeio
      if (gru.actionAnexoGruCusteio === "post") {
        let formDataGru = new FormData();
        formDataGru.append("file", blobGruCusteio);
        axios
          .post(
            `projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`,
            formDataGru
          )
          .then(() => {
            //atualizar informacoes locais apos o envio
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGruCusteio: true,
              actionAnexoGruCusteio: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoGruCusteio === "delete") {
        axios
          .delete(`projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`)
          .then(() => {
            setBlobGruCusteio();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGruCusteio: undefined,
              actionAnexoGruCusteio: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }

      //arquivo da gru Capital
      if (gru.actionAnexoGruCapital === "post") {
        let formDataGru = new FormData();
        formDataGru.append("file", blobGruCapital);
        axios
          .post(
            `projeto/${idProjeto}/gru/file?type=pathAnexoGruCapital`,
            formDataGru
          )
          .then(() => {
            //atualizar informacoes locais apos o envio
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGruCapital: true,
              actionAnexoGruCapital: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoGruCapital === "delete") {
        axios
          .delete(`projeto/${idProjeto}/gru/file?type=pathAnexoGruCapital`)
          .then(() => {
            setBlobGruCapital();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoGruCapital: undefined,
              actionAnexoGruCapital: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }

      //arquivo do comprovante Custeio
      if (gru.actionAnexoComprovanteCusteio === "post") {
        let formDataComprovante = new FormData();
        formDataComprovante.append("file", blobComprovanteCusteio);
        axios
          .post(
            `projeto/${idProjeto}/gru/file?type=pathAnexoComprovanteCusteio`,
            formDataComprovante
          )
          .then(() => {
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovanteCusteio: true,
              actionAnexoComprovanteCusteio: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoComprovanteCusteio === "delete") {
        axios
          .delete(
            `projeto/${idProjeto}/gru/file?type=pathAnexoComprovanteCusteio`
          )
          .then(() => {
            setBlobComprovanteCusteio();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovanteCusteio: undefined,
              actionAnexoComprovanteCusteio: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }

      //arquivo do comprovante Capital
      if (gru.actionAnexoComprovanteCapital === "post") {
        let formDataComprovante = new FormData();
        formDataComprovante.append("file", blobComprovanteCapital);
        axios
          .post(
            `projeto/${idProjeto}/gru/file?type=pathAnexoComprovanteCapital`,
            formDataComprovante
          )
          .then(() => {
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovanteCapital: true,
              actionAnexoComprovanteCapital: undefined,
            }));
          })
          .catch((e) => console.log(e));
      } else if (gru.actionAnexoComprovanteCapital === "delete") {
        axios
          .delete(
            `projeto/${idProjeto}/gru/file?type=pathAnexoComprovanteCapital`
          )
          .then(() => {
            setBlobComprovanteCapital();
            setGru((oldGru) => ({
              ...oldGru,
              pathAnexoComprovanteCapital: undefined,
              actionAnexoComprovanteCapital: undefined,
            }));
          })
          .catch((e) => console.log(e));
      }
    }
  }

  function handleGruChange(e, tipo) {
    let file = e.target.files[0];

    if (!file) {
      tipo === "capital" ? desanexarGru("capital") : desanexarGru("custeio");
      return;
    }

    file.ext = getFileExtension(file.type);

    if (tipo === "capital") {
      setBlobGruCapital(file);
      setGru((oldGru) => ({ ...oldGru, actionAnexoGruCapital: "post" }));
    } else {
      setBlobGruCusteio(file);
      setGru((oldGru) => ({ ...oldGru, actionAnexoGruCusteio: "post" }));
    }
  }

  function handleComprovanteChange(e, tipo) {
    let file = e.target.files[0];

    if (!file) {
      tipo === "capital"
        ? desanexarComprovante("capital")
        : desanexarComprovante("custeio");
      return;
    }

    file.ext = getFileExtension(file.type);

    if (tipo === "capital") {
      setBlobComprovanteCapital(file);
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoComprovanteCapital: "post",
      }));
    } else {
      setBlobComprovanteCusteio(file);
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoComprovanteCusteio: "post",
      }));
    }
  }

  function desanexarGru(tipo) {
    if (tipo === "capital") {
      setBlobGruCapital();
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoGruCapital: gru.pathAnexoGruCapital ? "delete" : undefined,
      }));
    } else {
      setBlobGruCusteio();
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoGruCusteio: gru.pathAnexoGruCusteio ? "delete" : undefined,
      }));
    }
  }

  function desanexarComprovante(tipo) {
    if (tipo === "capital") {
      setBlobComprovanteCapital();
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoComprovanteCapital: gru.pathAnexoComprovanteCapital
          ? "delete"
          : undefined,
      }));
    } else {
      setBlobComprovanteCusteio();
      setGru((oldGru) => ({
        ...oldGru,
        actionAnexoComprovanteCusteio: gru.pathAnexoComprovanteCusteio
          ? "delete"
          : undefined,
      }));
    }
  }

  //sincronizar valorTotalInicial com o valorDevolvido do componente pai
  useEffect(() => {
    setTotalDevolvido(valorTotalInicialCusteio + valorTotalInicialCapital);
  }, [valorTotalInicialCusteio, valorTotalInicialCapital, setTotalDevolvido]);

  //baixar arquivos inicialmente on mouse over
  function handleMouseOver() {
    setWasHovered(true);
    if (gru.id === undefined) return;

    setIsFetching(true);
    let actions = [];
    //caso haja um arquivo da gru e ele ja nao tenha sido baixado
    if (
      gru.pathAnexoGruCusteio &&
      !blobGruCusteio &&
      !gru.actionAnexoGruCusteio
    ) {
      actions.push(
        fileBufferAxios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`)
          .then((response) => {
            const mime = response.headers["content-type"];
            const data = response.data;
            const blob = new Blob([data], {
              type: mime,
            });
            blob.ext = getFileExtension(blob.type);

            setBlobGruCusteio(blob);
          })
          .catch((e) => console.log(e))
      );
    }
    //mesma logica para o comprovante
    // Custeio
    if (
      gru.pathAnexoComprovanteCusteio &&
      !blobComprovanteCusteio &&
      !gru.actionAnexoComprovanteCusteio
    ) {
      actions.push(
        fileBufferAxios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`)

          .then((response) => {
            const mime = response.headers["content-type"];
            const data = response.data;
            const blob = new Blob([data], {
              type: mime,
            });
            blob.ext = getFileExtension(blob.type);

            setBlobComprovanteCusteio(blob);
          })
          .catch((e) => console.log(e))
      );
    }

    // Capital
    if (
      gru.pathAnexoGruCapital &&
      !blobGruCapital &&
      !gru.actionAnexoGruCapital
    ) {
      actions.push(
        fileBufferAxios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`)
          .then((response) => {
            const mime = response.headers["content-type"];
            const data = response.data;
            const blob = new Blob([data], {
              type: mime,
            });
            blob.ext = getFileExtension(blob.type);

            setBlobGruCapital(blob);
          })
          .catch((e) => console.log(e))
      );
    }
    //mesma logica para o comprovante
    if (
      gru.pathAnexoComprovanteCapital &&
      !blobComprovanteCapital &&
      !gru.actionAnexoComprovanteCapital
    ) {
      actions.push(
        fileBufferAxios
          .get(`/projeto/${idProjeto}/gru/file?type=pathAnexoGruCusteio`)
          .then((response) => {
            const mime = response.headers["content-type"];
            const data = response.data;
            const blob = new Blob([data], {
              type: mime,
            });
            blob.ext = getFileExtension(blob.type);

            setBlobComprovanteCapital(blob);
          })
          .catch((e) => console.log(e))
      );
    }

    //apos baixar os arquivos, remover spinner de loading
    Promise.all(actions).finally(() => {
      setIsFetching(false);
    });
  }

  const gruBlobURLCusteio = blobGruCusteio
    ? URL.createObjectURL(blobGruCusteio)
    : "";
  const comprovanteBlobURLCusteio = blobComprovanteCusteio
    ? URL.createObjectURL(blobComprovanteCusteio)
    : "";

  const gruBlobURLCapital = blobGruCapital
    ? URL.createObjectURL(blobGruCapital)
    : "";
  const comprovanteBlobURLCapital = blobComprovanteCapital
    ? URL.createObjectURL(blobComprovanteCapital)
    : "";

  const hasChanges =
    Number(gru.valorTotalCapital) + Number(gru.valorTotalCusteio) !==
      Number(valorTotalInicialCusteio) + Number(valorTotalInicialCapital) ||
    gru.actionAnexoComprovanteCusteio ||
    gru.actionAnexoGruCusteio ||
    gru.actionAnexoComprovanteCapital ||
    gru.actionAnexoGruCapital;

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

      <div style={{ display: "flex", gap: "1rem" }}>
        <div className={style.mainContentGru}>
          <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Custeio</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.divTop}>
              <label htmlFor="valorGruCusteio">
                <p>Valor devolvido custeio:</p>
                <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                  (Valor restante:{" "}
                  {valorRestanteCusteio.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  )
                </p>
              </label>
              {!gru.valorTotalCusteio && (
                <div className={style.svgInputGru}>!</div>
              )}
              <input
                style={
                  !gru.valorTotalCusteio
                    ? { border: "0.2rem solid #ffea00" }
                    : {}
                }
                type="number"
                name="valorGru"
                id="valorGruCusteio"
                placeholder="Digite o valor aqui"
                value={gru.valorTotalCusteio || ""}
                onChange={(e) =>
                  setGru((oldGru) => ({
                    ...oldGru,
                    valorTotalCusteio: e.target.value,
                  }))
                }
              />
            </div>
            <div className={style.containerGru}>
              {gruBlobURLCusteio ? (
                <a href={gruBlobURLCusteio} target="_blank" rel="noreferrer">
                  <p
                    style={{
                      padding: "0.5rem",
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "1rem ",
                    }}
                  >
                    Visualizar GRU
                  </p>
                </a>
              ) : wasHovered ? (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  <svg
                    style={{ transform: "translate(-0.3rem,-0.2rem)" }}
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
                <button
                  onClick={() => desanexarGru("custeio")}
                  disabled={!blobGruCusteio}
                >
                  Desanexar
                </button>
                <label htmlFor="anexarGruCusteio">
                  <p>Anexar GRU</p>
                </label>
                <input
                  type="file"
                  name="anexarGru"
                  id="anexarGruCusteio"
                  onChange={(e) => handleGruChange(e, "custeio")}
                  hidden
                />
                <a
                  download={
                    gruBlobURLCusteio ? "anexo." + blobGruCusteio.ext : "anexo"
                  }
                  href={gruBlobURLCusteio}
                  style={
                    !gruBlobURLCusteio
                      ? { pointerEvents: "none", opacity: "50%" }
                      : {}
                  }
                >
                  Download
                </a>
              </div>
            </div>
            {}
            <div className={style.containerComprovante}>
              {comprovanteBlobURLCusteio ? (
                <a
                  href={comprovanteBlobURLCusteio}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p
                    style={{
                      padding: "0.5rem",
                      fontSize: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Visualizar Comprovante
                  </p>
                </a>
              ) : wasHovered ? (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  <svg
                    style={{ transform: "translate(-0.3rem,-0.2rem)" }}
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
                  onClick={() => {
                    desanexarComprovante("custeio");
                  }}
                  disabled={!blobComprovanteCusteio}
                >
                  Desanexar
                </button>
                <label htmlFor="slaCusteio">
                  <p>
                    Anexar <br /> Comprovante
                  </p>
                </label>
                <input
                  onChange={(e) => {
                    handleComprovanteChange(e, "custeio");
                  }}
                  type="file"
                  name="anexarGru"
                  id="slaCusteio"
                  hidden
                />
                <a
                  download={
                    comprovanteBlobURLCusteio
                      ? "anexo." + blobComprovanteCusteio.ext
                      : "anexo"
                  }
                  href={comprovanteBlobURLCusteio}
                  style={
                    !comprovanteBlobURLCusteio
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
        <div className={style.mainContentGru}>
          <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Capital</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={style.divTop}>
              <label htmlFor="valorGruCapital">
                <p>Valor devolvido capital:</p>
                <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                  (Valor restante:{" "}
                  {valorRestanteCapital.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  )
                </p>
              </label>
              {!gru.valorTotalCapital && (
                <div className={style.svgInputGru}>!</div>
              )}
              <input
                style={
                  !gru.valorTotalCapital
                    ? { border: "0.2rem solid #ffea00" }
                    : {}
                }
                type="number"
                name="valorGru"
                id="valorGruCapital"
                placeholder="Digite o valor aqui"
                value={gru.valorTotalCapital || ""}
                onChange={(e) =>
                  setGru((oldGru) => ({
                    ...oldGru,
                    valorTotalCapital: e.target.value,
                  }))
                }
              />
            </div>
            <div className={style.containerGru}>
              {gruBlobURLCapital ? (
                <a href={gruBlobURLCapital} target="_blank" rel="noreferrer">
                  <p
                    style={{
                      padding: "0.5rem",
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "1rem ",
                    }}
                  >
                    Visualizar GRU
                  </p>
                </a>
              ) : wasHovered ? (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  <svg
                    style={{ transform: "translate(-0.3rem,-0.2rem)" }}
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
                <button
                  onClick={() => {
                    desanexarGru("capital");
                  }}
                  disabled={!blobGruCapital}
                >
                  Desanexar
                </button>
                <label htmlFor="anexarGruCapital">
                  <p>Anexar GRU</p>
                </label>
                <input
                  type="file"
                  name="anexarGru"
                  id="anexarGruCapital"
                  onChange={(e) => {
                    handleGruChange(e, "capital");
                  }}
                  hidden
                />
                <a
                  download={
                    gruBlobURLCapital ? "anexo." + blobGruCapital.ext : "anexo"
                  }
                  href={gruBlobURLCapital}
                  style={
                    !gruBlobURLCapital
                      ? { pointerEvents: "none", opacity: "50%" }
                      : {}
                  }
                >
                  Download
                </a>
              </div>
            </div>
            {}
            <div className={style.containerComprovante}>
              {comprovanteBlobURLCapital ? (
                <a
                  href={comprovanteBlobURLCapital}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p
                    style={{
                      padding: "0.5rem",
                      fontSize: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Visualizar Comprovante
                  </p>
                </a>
              ) : wasHovered ? (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  <svg
                    style={{ transform: "translate(-0.3rem,-0.2rem)" }}
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
                  onClick={() => {
                    desanexarComprovante("capital");
                  }}
                  disabled={!blobComprovanteCapital}
                >
                  Desanexar
                </button>
                <label htmlFor="slaCapital">
                  <p>
                    Anexar <br /> Comprovante
                  </p>
                </label>
                <input
                  onChange={(e) => {
                    handleComprovanteChange(e, "capital");
                  }}
                  type="file"
                  name="anexarGru"
                  id="slaCapital"
                  hidden
                />
                <a
                  download={
                    comprovanteBlobURLCapital
                      ? "anexo." + blobComprovanteCapital.ext
                      : "anexo"
                  }
                  href={comprovanteBlobURLCapital}
                  style={
                    !comprovanteBlobURLCapital
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
