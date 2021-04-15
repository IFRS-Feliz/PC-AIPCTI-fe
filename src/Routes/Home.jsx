import { useContext } from "react";
import { Redirect } from "react-router";
import AuthContext, { isAdmin } from "../Contexts/Auth";

export default function Home() {
  const { user } = useContext(AuthContext);

  if (user) {
    if (isAdmin()) return <Redirect to="/admin" />;
    else return <Redirect to="/projetos" />;
  }

  return <Redirect to="/login" />;
}
