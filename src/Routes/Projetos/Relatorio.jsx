import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Item from "../../Components/Usuario/Item";

import style from "../../assets/css/routes/relatorio.module.css";
import Loading from "../../Components/Loading";

export default function Relatorio() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState([]);
  const [itens, setItens] = useState([]);

  const [isPostingItem, setIsPostingItem] = useState(false);

  useEffect(() => {
    axios
      .get(`/projeto/${id}`)
      .then((response) => {
        setProjeto(response.data.results[0]);
      })
      .catch((e) => console.log(e));
    axios
      .get(`/item?idProjeto=${id}`)
      .then((response) => {
        // ordenar de acordo por a coluna position
        response.data.results.sort((a, b) => {
          if (a.posicao > b.posicao) return 1;
          else if (a.posicao < b.posicao) return -1;
          else return 0;
        });
        setItens(response.data.results);
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <>
      <div className={style.tituloRelatorio}>
        <h1>Prestação de contas - {projeto.nome}</h1>
        <h3>Cadastre os itens referentes ao projeto abaixo:</h3>
      </div>

      <DragDropContext
        onDragEnd={(result) => {
          //caso tenha sido droppado fora da area droppable
          if (!result.source || !result.destination) return;
          //caso tenha sido droppado no mesmo lugar onde ja estava
          if (result.source.index === result.destination.index) return;

          //criar lista com itens reordanados
          const itensCopy = JSON.parse(JSON.stringify(itens));
          const [deleted] = itensCopy.splice(result.source.index, 1);
          itensCopy.splice(result.destination.index, 0, deleted);

          //atualizar posicoes no banco
          let itensToSend = [];
          itensCopy.forEach((itemCopy, index) => {
            itemCopy.posicao = index;
            itensToSend.push({ posicao: itemCopy.posicao, id: itemCopy.id });
          });

          axios
            .put("/item?posicoes=true", { itens: itensToSend })
            .then(() => {
              setItens(itensCopy);
            })
            .catch(() => {
              alert("Não foi possível alterar a ordem dos itens");
            });
        }}
      >
        <Droppable droppableId="itens">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {itens.map((item, index) => (
                <Draggable
                  draggableId={String(item.id)}
                  key={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Item
                        itens={itens}
                        index={index}
                        setItens={setItens}
                        dragHandleInnerProps={{ ...provided.dragHandleProps }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              <div style={{ position: "relative" }}>
                {isPostingItem && <Loading />}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={() => {
          setIsPostingItem(true);
          axios
            .post(`/item`, {
              itens: [
                {
                  idProjeto: id,
                  descricao: "",
                  tipo: "materialConsumo",
                  despesa: "capital",

                  nomeMaterialServico: "",
                  marca: "",
                  modelo: "",

                  quantidade: 0,
                  valorUnitario: 0,
                  valorTotal: 0,
                  frete: 0,
                  tipoDocumentoFiscal: "nfe",
                  isCompradoComCpfCoordenador: false,
                  isNaturezaSingular: false,
                  posicao: itens.length,

                  anexo: "",
                },
              ],
            })
            .then((response) => {
              setItens([
                ...itens,
                {
                  ...response.data.results[0],
                  dataCompraContratacao: "",
                  cnpjFavorecido: "",
                  numeroDocumentoFiscal: "",
                },
              ]);
            })
            .catch(() => {
              alert("Não foi possível criar o novo item.");
            })
            .finally(() => setIsPostingItem(false));
        }}
        className={style.buttonAdicionar}
      >
        Adicionar
      </button>
    </>
  );
}
