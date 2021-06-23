import style from "../assets/css/components/item.module.css";

function TextInput({
  name,
  object,
  setObject,
  index = null,
  label,
  isNumber = false,
  objectToCompare,
  setDirtyFields,
  onChangeExtra,
  warnings,
  setWarnings,
  warningCriteria,
  ...rest
}) {
  let value = index === null ? object[name] : object[index][name];
  value = !value && value !== 0 ? "" : value;

  let warning = index === null ? warnings[name] : warnings[index];
  warning = warning && index !== null ? warning[name] : warning;

  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      {warning && <WarningDiv warning={warning} />}
      <input
        style={warning ? { border: "0.2rem solid #ffea00" } : {}}
        id={name}
        type={isNumber ? "number" : "text"}
        value={value}
        onChange={(e) =>
          handleChange(
            e,
            name,
            object,
            setObject,
            index,
            objectToCompare,
            setDirtyFields,
            onChangeExtra,
            setWarnings,
            warningCriteria,
            isNumber
          )
        }
        {...rest}
      />
      <br />
    </div>
  );
}

function SelectInput({
  name,
  object,
  setObject,
  index = null,
  children,
  label,
  objectToCompare,
  setDirtyFields,
  onChangeExtra,
  warnings,
  setWarnings,
  warningCriteria,
  ...rest
}) {
  let warning = index === null ? warnings[name] : warnings[index];
  warning = warning && index !== null ? warning[name] : warning;

  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      {warning && <WarningDiv warning={warning} />}
      <select
        style={warning ? { border: "0.2rem solid #ffea00" } : {}}
        id={name}
        type="text"
        value={index === null ? object[name] : object[index][name]}
        onChange={(e) =>
          handleChange(
            e,
            name,
            object,
            setObject,
            index,
            objectToCompare,
            setDirtyFields,
            onChangeExtra,
            setWarnings,
            warningCriteria
          )
        }
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

function DateInput({
  name,
  object,
  setObject,
  index = null,
  label,
  objectToCompare,
  setDirtyFields,
  onChangeExtra,
  warnings,
  setWarnings,
  warningCriteria,
  ...rest
}) {
  let warning = index === null ? warnings[name] : warnings[index];
  warning = warning && index !== null ? warning[name] : warning;

  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      {warning && <WarningDiv warning={warning} />}
      <input
        style={warning ? { border: "0.2rem solid #ffea00", paddingRight: "2rem", boxSizing: "border-box", width: "283.14px", height: "39.94px"} : {}}
        id={name}
        type="date"
        value={index === null ? object[name] || "" : object[index][name] || ""}
        onChange={(e) =>
          handleChange(
            e,
            name,
            object,
            setObject,
            index,
            objectToCompare,
            setDirtyFields,
            onChangeExtra,
            setWarnings,
            warningCriteria
          )
        }
        {...rest}
      />
    </div>
  );
}

function CheckBoxInput({
  name,
  object,
  setObject,
  index = null,
  label,
  objectToCompare,
  setDirtyFields,
  ...rest
}) {
  function handleChange() {
    handleSettingDirtyFields(
      index === null ? !object[name] : !object[index][name],
      object,
      name,
      objectToCompare,
      index,
      setDirtyFields,
      true
    );
    //caso seja parte de uma lista de objetos
    if (index !== null) {
      let newObject = JSON.parse(JSON.stringify(object));
      newObject[index][name] = !object[index][name];
      setObject(newObject);
      return;
    }
    //caso seja parte de um objeto apenas
    setObject({ ...object, [name]: !object[name] });
  }

  const checked = index === null ? object[name] : object[index][name];
  return (
    <div className={style.checkBoxLabelGroup}>
      <input
        id={name}
        type="checkbox"
        checked={checked || false}
        onChange={handleChange}
        {...rest}
      />
      <label htmlFor={name}>{label || name}</label>
    </div>
  );
}

function handleChange(
  e,
  name,
  object,
  setObject,
  index,
  objectToCompare,
  setDirtyFields,
  extra, //extra function to run on change
  setWarnings,
  warningCriteria = [],
  isNumber = false
) {
  let value =
    isNumber && e.target.value ? Number(e.target.value) : e.target.value;

  handleSettingDirtyFields(
    value,
    object,
    name,
    objectToCompare,
    index,
    setDirtyFields
  );

  handleSettingsWarnings(value, name, index, setWarnings, warningCriteria);

  // caso seja parte de uma lista de objetos
  if (index !== null) {
    let newObject = JSON.parse(JSON.stringify(object));
    if (extra) newObject = extra(newObject, index, value);
    newObject[index][name] = value;
    setObject(newObject);
    return;
  }
  //caso seja parte de um objeto apenas
  if (extra) {
    let newObject = JSON.parse(JSON.stringify(object));
    newObject = extra(newObject, index, value);
    setObject({ ...newObject, [name]: value });
  } else {
    setObject({ ...object, [name]: value });
  }
}

function handleSettingDirtyFields(
  value,
  object,
  name,
  objectToCompare,
  index,
  setDirtyFields,
  isBoolean = false
) {
  if (index === null) {
    if (
      // eslint-disable-next-line
      objectToCompare[name] != value &&
      // eslint-disable-next-line
      (!(!value && !objectToCompare[name]) || isBoolean)
    ) {
      setDirtyFields((oldDirtyFields) => ({
        ...oldDirtyFields,
        [name]: true,
      }));
    } else {
      setDirtyFields((oldDirtyFields) => {
        const newDirtyFields = { ...oldDirtyFields };
        delete newDirtyFields[name];
        return newDirtyFields;
      });
    }
  } else {
    if (objectToCompare.length !== object.length) return;
    if (
      // eslint-disable-next-line
      objectToCompare[index][name] != value &&
      // eslint-disable-next-line
      (!(!value && !objectToCompare[index][name]) || isBoolean)
    ) {
      setDirtyFields((oldDirtyFields) => {
        const newDirtyFields = [...oldDirtyFields];

        if (newDirtyFields[index] === undefined) {
          newDirtyFields[index] = { [name]: true };
        } else newDirtyFields[index][name] = true;
        return newDirtyFields;
      });
    } else {
      setDirtyFields((oldDirtyFields) => {
        const newDirtyFields = [...oldDirtyFields];
        if (newDirtyFields[index] === undefined) {
          newDirtyFields[index] = {};
        } else delete newDirtyFields[index][name];
        return newDirtyFields;
      });
    }
  }
}

function handleSettingsWarnings(
  value,
  name,
  index,
  setWarnings,
  warningCriteria
) {
  if (setWarnings && warningCriteria.length > 0) {
    setWarnings((oldWarnings) => {
      const newWarnings = JSON.parse(JSON.stringify(oldWarnings));
      warningCriteria.forEach((criteria) => {
        const [hasWarning, warningMessage] = criteria(value);
        const currentWarning =
          index !== null
            ? newWarnings[index]
              ? newWarnings[index][name]
              : undefined
            : newWarnings[name];
        const shouldDeleteCurrentMessage = currentWarning === warningMessage;
        //caso haja um warning, setar
        if (hasWarning) {
          if (index !== null) {
            //caso a lista de warnings nao tenha sido utilizada nessa posicao ainda
            if (!newWarnings[index]) {
              newWarnings[index] = { [name]: warningMessage };

              //caso contrario
            } else newWarnings[index][name] = warningMessage;
          } else newWarnings[name] = warningMessage;

          //caso nao tenha um warning
        } else if (shouldDeleteCurrentMessage) {
          if (index !== null) delete newWarnings[index][name];
          else delete newWarnings[name];
        }
      });
      return newWarnings;
    });
  }
}

function notEmptyCriteria(value) {
  return [!value && value !== 0, "Vazio"];
}

function notEmptyNumberCriteria(value) {
  return [!value && value !== 0, "Vazio"];
}

//provover a um erro, nao somente warning
function cnpjCriteria(value) {
  return [value.length !== 14, "Deve ter 14 caracteres"];
}

function WarningDiv({ warning }) {
  return (
    <div
      title={warning}
      className={style.inputWarning}
      style={{ marginLeft: "0.5rem" }}
    >
      <p>!</p>
    </div>
  );
}

export {
  TextInput,
  SelectInput,
  DateInput,
  CheckBoxInput,
  notEmptyCriteria,
  notEmptyNumberCriteria,
  cnpjCriteria,
};
