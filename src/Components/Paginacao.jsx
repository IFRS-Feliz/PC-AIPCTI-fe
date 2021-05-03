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
