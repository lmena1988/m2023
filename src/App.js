//Importaciones necesarias
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import login from "./components/login";
import dashboard from "./components/dashboard";
import Usuarios from "./components/usuarios";
import Seguridad from "./components/ListadoU";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import Camaras from "./components/camaras";
import ModificarLogin from "./components/modificarlogin";


const cookies = new Cookies(); //Cookies para el control de ingreso

function App() {
  const usuarioNombre = cookies.get('usuario');

  //Función para cerrar la sesión luego lleva a inicio de sesion
  function cerrarSesion() {
    cookies.remove('usuario', { path: "/" });
    window.location.href = './';
  }

  return (
    <><div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <a className="navbar-brand ps-3" href="#!">
          <div className="sb-nav-link-icon" onClick={() => window.location = "/dashboard"}><i className="fas fa-microchip"></i>&nbsp; Sistema Biométrico</div>
        </a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
        <div className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">

        </div>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <span className="nav-link" role="button" onClick={() => window.location.reload()} ><i className="fas fa-sync-alt"></i></span>
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></span>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/modificarlogin">Modificar datos</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#!" onClick={() => cerrarSesion()}>Salir</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">MENÚ</div>
                <a className="nav-link" href="./dashboard">
                  <div className="sb-nav-link-icon"><i className="fas fa-home"></i></div>
                  HOME
                </a>
                <a className="nav-link" href="./usuarios">
                  <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
                  CREAR USUARIOS
                </a>
                <a className="nav-link" href="./ListadoU">
                  <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
                  LISTADO USUARIOS
                </a>
                <a className="nav-link" href="./camaras">
                  <div className="sb-nav-link-icon"><i className="fas fa-camera"></i></div>
                  CAMARA
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">CONECTADO COMO:</div>
              {usuarioNombre}
            </div>
          </nav>
        </div>
        <BrowserRouter>
        <Switch>
          <Route exact path={"/"} component={login} />
          {/* Modificar esta línea para pasar el nombre de usuario */}
          <Route exact path="/modificarlogin" render={() => <ModificarLogin usuarioNombre={usuarioNombre} />} />
          <Route exact path="/dashboard" component={dashboard} /> 
          <Route exact path="/usuarios" component={Usuarios} />
          <Route exact path="/ListadoU" component={Seguridad} />    
          <Route exact path="/camaras" component={Camaras} />      
        </Switch>
      </BrowserRouter>
        <ToastContainer
          theme="dark"
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div></>
  );

}

export default App;
