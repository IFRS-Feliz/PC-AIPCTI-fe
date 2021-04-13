import { useHistory } from "react-router";

export default function Admin() {
  const history = useHistory();
  return (
    <div>
      <button onClick={() => history.push("/admin/usuarios")}>Usuários</button>
      <button onClick={() => history.push("/admin/editais")}>Editais</button>
    </div>
  );
}
