import axios from "../../../axios";
import { useEffect, useState } from "react";
import { getProjectArrays } from "../../../Helpers/EditarAdicionarUsuario";
import { MainContent } from "./Contents";

import style from "../../../assets/css/components/item.module.css";
import Loading from "../../Loading";

export default function Item({ itens, index, setItens, dragHandleInnerProps }) {
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
              <button onClick={() => handleChangeContent("informacoes")}>
                Informações
              </button>
            </span>

            <span
              className={content === "orcamentos" ? style.ticoAppearWhite : ""}
            >
              <button onClick={() => handleChangeContent("orcamentos")}>
                Orçamentos
              </button>
            </span>

            <span
              className={content === "justificativa" ? style.ticoAppear : ""}
            >
              <button
                onClick={() => handleChangeContent("justificativa")}
                disabled={!item.isNaturezaSingular}
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
            />
          </div>
        )}
      </div>
      <div className={style.tools}>
        <button
          onClick={() => handleSave(item, orcamentos)}
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
    </div>
  );
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
