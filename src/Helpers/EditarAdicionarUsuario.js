export function handleAddProject(editais, setNewProjetos, newProjetos) {
  if (editais.length === 0) {
    alert("É necessário adicionar editais antes de adicionar projetos.");
    return;
  }
  setNewProjetos([
    ...newProjetos,
    {
      nome: "",
      valorRecebidoCapital: 0,
      valorRecebidoCusteio: 0,
      valorRecebidoTotal: 0,
      idEdital: 1,
    },
  ]);
}

export function handleCPFInputChange(e, errors, setErrors, user, setUser) {
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

export function handleNomeInputChange(e, errors, setErrors, user, setUser) {
  setUser({ ...user, nome: e.target.value });
  if (e.target.value.length === 0) {
    setErrors({ ...errors, nome: true });
  } else if (errors.nome) {
    setErrors({ ...errors, nome: false });
  }
}

export function handleEmailInputChange(e, errors, setErrors, user, setUser) {
  setUser({ ...user, email: e.target.value });
  if (!/^[^\s@]+@[^\s@]+$/.test(e.target.value)) {
    setErrors({ ...errors, email: true });
  } else if (errors.email) {
    setErrors({ ...errors, email: false });
  }
}

export function fieldsHaveErrors(projetos, errors) {
  const errosNomesProjetos = !!projetos.filter((p) => p.nome === "").length;
  return Object.values(errors).includes(true) || errosNomesProjetos;
}
