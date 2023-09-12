import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { dirpagip } from "../constantes";
import { toast } from "react-toastify";
import Swal from 'sweetalert2/dist/sweetalert2.js';

const cookies = new Cookies(); // Cookies para el control de ingreso

class ModificarLogin extends Component {
  state = {
    form: {
      clave: '',
      usuarioN: '',
      claveN: '',
    },
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Función para el envío de los datos para modificar los datos de inicio de sesión
  modificarSesion = async () => {
    try {
      const { usuario, clave, usuarioN, claveN } = this.state.form;

      const response = await fetch(`${dirpagip}/modificar-login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ usuario, clave, nuevoUsuario: usuarioN, nuevaClave: claveN }),
      });

      if (response.status === 200) {
        // Datos de inicio de sesión modificados correctamente
        toast.success('Datos de inicio de sesión modificados correctamente');
        cookies.remove('usuario', { path: '/' });
        window.location.href = './';
      } else {
        const errorMessage = await response.json();
        // Muestra un mensaje de error si la modificación falla
        toast.error(errorMessage.mensaje);
      }
    } catch (err) {
      // En caso de error muestra error
      console.error(err.message);
      toast.error('ERROR: ' + err.message);
    }
  };

  componentDidMount() {
    // Verifica si está ingresado y si no, lo redirige al inicio de sesión
    if (!cookies.get('usuario')) {
      window.location.href = './';
    }
  }

  render() {
    return (
      <>
        <div className="modal position-center d-block  " tabIndex="-1" id="modalSignin">
          <div className="modal-dialog modal-fullscreen position-center d-block" role="document">
            <div className="modal-content rounded-5 shadow">
              <div className="modal-header p-4 pb-4 ">
                <h2 className="modal-title">
                  <i className="fas fa-pen"></i>&nbsp;Sistema Biométrico
                </h2>
              </div>
              <div className="modal-body p-4 ">
                <div id="layoutAuthentication_content">
                  <main>
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="w-auto">
                          <div className="card shadow-lg border-0 rounded-lg mt-5">
                            <div className="card-header">
                              <h3 className="text-center font-weight-light my-4">
                                <i className="fas fa-user-edit"></i>&nbsp;Modificar Datos
                              </h3>
                            </div>
                            <div className="card-body">
                              <form>
                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control shadow-none"
                                    id="inputPassword"
                                    type="password"
                                    placeholder="Contraseña actual"
                                    name="clave"
                                    onChange={this.handleChange}
                                  />
                                  <label for="inputPassword">
                                    <i className="fas fa-key"></i>&nbsp;Contraseña actual:
                                  </label>
                                </div>
                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control shadow-none"
                                    id="inputUserN"
                                    type="text"
                                    placeholder="Nuevo Usuario"
                                    name="usuarioN"
                                    onChange={this.handleChange}
                                  />
                                  <label for="inputEmail">
                                    <i className="fas fa-user"></i>&nbsp;Nuevo Usuario:
                                  </label>
                                </div>
                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control shadow-none"
                                    id="inputPasswordN"
                                    type="password"
                                    placeholder="Nueva Contraseña"
                                    name="claveN"
                                    onChange={this.handleChange}
                                  />
                                  <label for="inputPasswordN">
                                    <i className="fas fa-key"></i>&nbsp;Nueva Contraseña:
                                  </label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center mt-4 mb-2">
                                  <a className="btn btn-dark col-6" href="#!" onClick={this.modificarSesion}>
                                    <i className="far fa-edit"></i>&nbsp;Modificar
                                  </a>
                                </div>
                              </form>
                            </div>
                            <div className="card-footer text-center py-3">
                              <div className="small">Puede modificar el usuario y la contraseña si es necesario.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
              <div className="modal-footer ">
                <button
                  type="button"
                  onClick={() => (window.location.href = './dashboard')}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-angle-left"></i>&nbsp;Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ModificarLogin;