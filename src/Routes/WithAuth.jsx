import { useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthContext, { isAdmin } from "../Contexts/Auth";

export default function WithAuth({ children, isAdminOnly = false }) {
  const { user } = useContext(AuthContext);

  if (isAdminOnly) {
    return isAdmin() ? children : <Redirect to="/login" />;
  }

  return user ? children : <Redirect to="/login" />;
}
