import style from "../assets/css/components/item.module.css";

function TextInput({
  name,
  object,
  setObject,
  index = null,
  label,
  isNumber = false,
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
          handleChange(e, name, object, setObject, index, isNumber)
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
}) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <select
        id={name}
        type="text"
        value={index === null ? object[name] : object[index][name]}
        onChange={(e) => handleChange(e, name, object, setObject, index)}
      >
        {children}
      </select>
    </div>
  );
}

function DateInput({ name, object, setObject, index = null, label }) {
  return (
    <div className={style.inputLabelGroup}>
      <label htmlFor={name}>{(label || name) + ": "}</label>
      <input
        id={name}
        type="date"
        value={index === null ? object[name] || "" : object[index][name] || ""}
        onChange={(e) => handleChange(e, name, object, setObject, index)}
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
  ...rest
}) {
  function handleChange() {
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

function handleChange(e, name, object, setObject, index, isNumber = false) {
  let value =
    isNumber && e.target.value ? Number(e.target.value) : e.target.value;
  //caso seja parte de uma lista de objetos
  if (index !== null) {
    let newObject = JSON.parse(JSON.stringify(object));
    newObject[index][name] = value;
    setObject(newObject);
    return;
  }
  //caso seja parte de um objeto apenas
  setObject({ ...object, [name]: value });
}

export { TextInput, SelectInput, DateInput, CheckBoxInput };
