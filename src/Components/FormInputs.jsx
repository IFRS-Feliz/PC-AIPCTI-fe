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
  ...rest
}) {
  let value = index === null ? object[name] : object[index][name];
  value = !value && value !== 0 ? "" : value;

  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <input
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
            isNumber
          )
        }
        {...rest}
      />
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
  ...rest
}) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <select
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
            setDirtyFields
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
  ...rest
}) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <input
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
            setDirtyFields
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

  //caso seja parte de uma lista de objetos
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

export { TextInput, SelectInput, DateInput, CheckBoxInput };
