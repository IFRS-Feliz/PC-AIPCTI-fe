//import axios from "axios";
import Header from "./Components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Routes/Login";
import Home from "./Routes/Home";
import Projetos from "./Routes/Projetos";
import Admin from "./Routes/Admin";
import Adicionar from "./Routes/Adicionar";

import "./assets/css/global.css";

export default function App() {
  return (
    <>
      <Router>
        <Header />
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
