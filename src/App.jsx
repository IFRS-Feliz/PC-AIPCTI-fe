import axios from "axios";
import Header from "./Components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Routes/Login";
import Home from "./Routes/Home";
import Projetos from "./Routes/Projetos";
import Admin from "./Routes/Admin";
import Adicionar from "./Routes/Adicionar";

export default function App() {
  return (
    <>
      <button
        onClick={() => {
          axios
            .get("http://localhost:5000/logout")
            .then((response) => console.log(response, "Deslogado"));
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
      <Header />
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin/adicionar">
            <Adicionar />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/projetos">
            <Projetos />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
