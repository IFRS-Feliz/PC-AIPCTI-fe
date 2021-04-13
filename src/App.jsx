//import axios from "axios";
import Header from "./Components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Routes/Login";
import Home from "./Routes/Home";
import Projetos from "./Routes/Projetos";
import Admin from "./Routes/Admin/Admin";
import Usuarios from "./Routes/Admin/Usuarios/Usuarios";
import Adicionar from "./Routes/Admin/Usuarios/Adicionar";
import Editais from "./Routes/Admin/Editais/Editais";

import "./assets/css/global.css";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/admin/usuarios/adicionar">
            <Adicionar />
          </Route>
          <Route exact path="/admin/usuarios">
            <Usuarios />
          </Route>
          <Route exact path="/admin/editais">
            <Editais />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/projetos">
            <Projetos />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
