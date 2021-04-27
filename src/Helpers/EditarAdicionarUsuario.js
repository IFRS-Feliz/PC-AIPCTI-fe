export function handleAddProject(
  editaisOrUsuarios,
  setNewProjetos,
  newProjetos,
  cpf = "",
  edital = ""
) {
  if (editaisOrUsuarios.length === 0) {
    alert(
      "É necessário ter ao menos um edital e um usuário antes de criar projetos."
    );
    return;
  }
  setNewProjetos([
    ...newProjetos,
    {
      cpfUsuario: cpf || editaisOrUsuarios[0].cpf || "", //cpf somente estara setado em casos de edição de usuarios
      nome: "",
      valorRecebidoCapital: 0,
      valorRecebidoCusteio: 0,
      valorRecebidoTotal: 0,
      idEdital: edital || editaisOrUsuarios[0].id || "", //edital somente estara setado em casos de edição de editais
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

//editais
export function handleDataInicioInputChange(
  e,
  errors,
  setErrors,
  edital,
  setEdital
) {
  setEdital({ ...edital, dataInicio: e.target.value });
  if (e.target.value === "") {
    setErrors({ ...errors, dataInicio: true });
  } else if (errors.dataInicio) {
    setErrors({ ...errors, dataInicio: false });
  }
}

export function handleDataFimInputChange(
  e,
  errors,
  setErrors,
  edital,
  setEdital
) {
  setEdital({ ...edital, dataFim: e.target.value });
  if (e.target.value === "") {
    setErrors({ ...errors, dataFim: true });
  } else if (errors.dataFim) {
    setErrors({ ...errors, dataFim: false });
  }
}

export function handleDataLimiteInputChange(
  e,
  errors,
  setErrors,
  edital,
  setEdital
) {
  setEdital({ ...edital, dataLimitePrestacao: e.target.value });
  if (e.target.value === "") {
    setErrors({ ...errors, dataLimitePrestacao: true });
  } else if (errors.dataLimitePrestacao) {
    setErrors({ ...errors, dataLimitePrestacao: false });
  }
}

//editar

export function getProjectArrays(initialProjetos, newProjetos) {
  //projetos novos adicionados durante a edicao nao tem um id
  //projetos deletados estao no initialProjects mas nao no newProjects
  return {
    addedProjects: newProjetos.filter((projeto) => projeto.id === undefined),
    updatedProjects: newProjetos.filter((projeto) => projeto.id !== undefined),
    deletedProjects: initialProjetos.filter(
      (projeto) => !newProjetos.includes(projeto)
    ),
  };
}
