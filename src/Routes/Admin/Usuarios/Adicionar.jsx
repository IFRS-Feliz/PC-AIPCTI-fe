import axios from "../../../axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import NovoProjeto from "../../../Components/NovoProjeto";

import style from "../../../assets/css/routes/adicionar.module.css";

export default function Adicionar() {
  const history = useHistory();

  const [user, setUser] = useState({ cpf: "", nome: "", email: "" });
  const [projetos, setProjetos] = useState([]);
  const [editais, setEditais] = useState([]);

  const [errors, setErrors] = useState({
    cpf: true,
    nome: true,
    email: true,
    projetos: [],
  });

  const [wasTouched, setWasTouched] = useState({
    cpf: false,
    nome: false,
    email: false,
  });

  useEffect(() => {
    axios
      .get("/edital")
      .then((response) => {
        setEditais(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleAddProject() {
    if (editais.length === 0) {
      alert("É necessário adicionar editais antes de adicionar projetos.");
      return;
    }
    setProjetos([
      ...projetos,
      {
        nome: "",
        valorRecebidoCapital: 0,
        valorRecebidoCusteio: 0,
        valorRecebidoTotal: 0,
        idEdital: 1,
      },
    ]);
  }

  function handleCreateUser() {
    console.log(user);
    console.log(projetos);

    axios
      .post("/usuario", {
        cpf: user.cpf,
        nome: user.nome,
        email: user.email,
        isAdmin: false,
      })
      .then(() => {
        if (projetos.length > 0) {
          axios
            .post("/projeto", {
              cpfUsuario: user.cpf,
              projetos: projetos,
            })
            .then(() => history.push("/admin/usuarios"))
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //form validation
  function fieldsHaveErrors() {
    const errosNomesProjetos = !!projetos.filter((p) => p.nome === "").length;
    return Object.values(errors).includes(true) || errosNomesProjetos;
  }

  function handleCPFInputChange(e) {
    //remover caracteres indesejados
    e.target.value = e.target.value.replace(/[^\d]/g, "");

    setUser({ ...user, cpf: e.target.value });

    //adicionar pontos e hifen
    if (e.target.value.length === 11) {
      e.target.value = e.target.value.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    }

    if (e.target.value.length !== 14) {
      setErrors({ ...errors, cpf: true });
    } else if (errors.cpf) {
      setErrors({ ...errors, cpf: false });
    }
  }

  function handleNomeInputChange(e) {
    setUser({ ...user, nome: e.target.value });
    if (e.target.value.length === 0) {
      setErrors({ ...errors, nome: true });
    } else if (errors.nome) {
      setErrors({ ...errors, nome: false });
    }
  }

  function handleEmailInputChange(e) {
    setUser({ ...user, email: e.target.value });
    if (!/^[^\s@]+@[^\s@]+$/.test(e.target.value)) {
      setErrors({ ...errors, email: true });
    } else if (errors.email) {
      setErrors({ ...errors, email: false });
    }
  }

  return (
    <>
      <div className={style.containerAdicionar}>
        <h1 className={style.adicionarH1}>Adicionar um usuário:</h1>
        <form
          className={style.adicionarUserForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={style.adicionarUserFormField}>
            <label htmlFor="cpf">CPF:</label>
            <input
              id="cpf"
              type="text"
              onBlur={() => setWasTouched({ ...wasTouched, cpf: true })}
              onChange={(e) => handleCPFInputChange(e)}
              className={
                errors.cpf && wasTouched.cpf
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
              maxLength={11 + 3}
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              onBlur={() => setWasTouched({ ...wasTouched, nome: true })}
              onChange={(e) => handleNomeInputChange(e)}
              className={
                errors.nome && wasTouched.nome
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
          <div className={style.adicionarUserFormField}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              onBlur={() => setWasTouched({ ...wasTouched, email: true })}
              onChange={(e) => handleEmailInputChange(e)}
              className={
                errors.email && wasTouched.email
                  ? `wrongInput ${style.normalInput}`
                  : style.normalInput
              }
            />
          </div>
        </form>

        <hr className={style.adicionarHr}></hr>

        <h1 className={style.adicionarH1}>Projetos do usuário:</h1>

        {projetos.length > 0 &&
          projetos.map((projeto, index) => {
            return (
              <NovoProjeto
                key={index}
                projetos={projetos}
                setProjetos={setProjetos}
                index={index}
                editais={editais}
              />
            );
          })}

        <button
          className={style.adicionarBotaoMaisProjeto}
          onClick={handleAddProject}
        >
          <svg height="1.5rem" width="1.5rem">
            <path
              fill="#FFFFFF"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            />
          </svg>
          <p>Projeto</p>
        </button>
        {/* <button onClick={() => console.log(projetos)}>loggar projetos</button> */}
        <button
          disabled={fieldsHaveErrors()}
          className={style.adicionarBotaoCriarUsuario}
          onClick={handleCreateUser}
        >
          <svg height="1.5rem" width="1.5rem" fill="#FFFFFF">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </>
  );
}
