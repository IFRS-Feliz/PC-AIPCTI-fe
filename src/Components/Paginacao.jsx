import style from "../assets/css/components/paginacao.module.css";

export default function Paginacao({ currentPage, setCurrentPage, nextPage }) {
  let botoesPrevious = [];
  let botoesNext = [];

  function setBotoes() {
    //botoes de paginas anteriores
    for (let i = 1; i < currentPage; i++) {
      if (i === 1 || currentPage - i <= 2) {
        botoesPrevious.push(
          <button key={i} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        );
      } else if (!botoesPrevious.includes("...")) botoesPrevious.push("...");
    }

    //botoes de paginas seguintes
    if (nextPage) {
      for (
        let i = currentPage + 1;
        i < currentPage + 1 + nextPage.nextPagesCount;
        i++
      ) {
        if (
          i <= currentPage + 2 ||
          i === currentPage + nextPage.nextPagesCount
        ) {
          botoesNext.push(
            <button key={i} onClick={() => setCurrentPage(i)}>
              {i}
            </button>
          );
        } else if (!botoesNext.includes("...")) botoesNext.push("...");
      }
    }
  }
  setBotoes();

  return (
    <div className={style.containerPaginacao}>
      {currentPage > 1 && (
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          &#8592;
        </button>
      )}
      {botoesPrevious.map((botao) => {
        return botao;
      })}
      <p>{currentPage}</p>
      {botoesNext.map((botao) => {
        return botao;
      })}
      {nextPage && (
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          &#8594;
        </button>
      )}
    </div>
  );
}

export function SortOptions({ setSortBy, setOrder, sortBy, order, options }) {
  const style = {
    padding: "0 0.4rem",
    margin: "0 0.2rem",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    border: "none",
    height: "100%",
  };
  const optionButtons = options.map((option) => (
    <button
      key={option}
      id={option}
      style={
        sortBy === option ? { ...style, border: "3px solid black" } : style
      }
      onClick={() => {
        if (sortBy === option) {
          setOrder((order) => (order === "ASC" ? "DESC" : "ASC"));
        } else {
          setSortBy(option);
          setOrder("ASC");
        }
      }}
    >
      {sortBy === option && (
        <span style={{ fontSize: "1.5rem" }}>
          {order === "ASC" ? "↓" : "↑"}
        </span>
      )}
      {getOptionName(option)}
    </button>
  ));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p style={{ paddingRight: "0.5rem" }}>Ordenar:</p>
      {optionButtons}
    </div>
  );

  function getOptionName(option) {
    switch (option) {
      case "id":
        return "Data de criação";

      case "dataInicio":
        return "Data de início do edital";

      default:
        return option.charAt(0).toUpperCase() + option.slice(1);
    }
  }
}
