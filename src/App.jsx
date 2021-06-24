import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Routes/Login";
import Home from "./Routes/Home";
import NotFound404 from "./Routes/NotFound404";

import Admin from "./Routes/Admin/Admin";
import Usuarios from "./Routes/Admin/Usuarios/Usuarios";
import Adicionar from "./Routes/Admin/Usuarios/Adicionar";
import Editar from "./Routes/Admin/Usuarios/Editar";
import Editais from "./Routes/Admin/Editais/Editais";
import ProjetosMenu from "./Routes/Admin/Projetos/Projetos";
import AdicionarEditais from "./Routes/Admin/Editais/Adicionar";
import EditarEditais from "./Routes/Admin/Editais/Editar";

import Projetos from "./Routes/Projetos/Projetos";
import Relatorio from "./Routes/Projetos/Relatorio";

import Header from "./Components/Header";
import Menu from "./Components/Menu";

import { AuthContextProvider } from "./Contexts/Auth";
import WithAuth from "./Routes/WithAuth";

import "./assets/css/global.css";
import AlterarSenha from "./Routes/AlterarSenha";

export default function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <Header />
          <Menu />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/admin">
              <WithAuth isAdminOnly={true}>
                <Admin />
              </WithAuth>
            </Route>
            <Route exact path="/admin/usuarios">
              <WithAuth isAdminOnly={true}>
                <Usuarios />
              </WithAuth>
            </Route>
            <Route exact path="/admin/usuarios/adicionar">
              <WithAuth isAdminOnly={true}>
                <Adicionar />
              </WithAuth>
            </Route>
            <Route exact path="/admin/usuarios/:cpf">
              <WithAuth isAdminOnly={true}>
                <Editar />
              </WithAuth>
            </Route>
            <Route exact path="/admin/editais">
              <WithAuth isAdminOnly={true}>
                <Editais />
              </WithAuth>
            </Route>
            <Route exact path="/admin/projetos">
              <WithAuth isAdminOnly={true}>
                <ProjetosMenu />
              </WithAuth>
            </Route>
            <Route exact path="/admin/editais/adicionar">
              <WithAuth isAdminOnly={true}>
                <AdicionarEditais />
              </WithAuth>
            </Route>
            <Route exact path="/admin/editais/:id">
              <WithAuth isAdminOnly={true}>
                <EditarEditais />
              </WithAuth>
            </Route>
            <Route exact path="/projetos">
              <WithAuth>
                <Projetos />
              </WithAuth>
            </Route>
            <Route exact path="/projetos/:id">
              <WithAuth>
                <Relatorio />
              </WithAuth>
            </Route>
            <Route exact path="/senha">
              <WithAuth isAdminOnly={false}>
                <AlterarSenha />
              </WithAuth>
            </Route>
            <Route>
              <NotFound404 />
            </Route>
          </Switch>
        </AuthContextProvider>
      </Router>
    </>
  );
}
