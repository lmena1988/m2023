import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { dirpagip, direccion } from "../constantes"

const cookies = new Cookies();

class Usuarios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      nombre: '',
      apellidos: '',
      edad: '',
      correo: '',
      telefono: '',
      direccion: '',
      password: '',
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleEnrollButton = async () => {
    try {
      const response = await axios.get(`${direccion}/enroll-huella`);
    } catch (error) {
      console.error('Error al enviar la solicitud de enrolamiento:', error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      id: this.props.fingerprintId,
      nombre: this.state.nombre,
      apellidos: this.state.apellidos,
      edad: this.state.edad,
      correo: this.state.correo,
      telefono: this.state.telefono,
      direccion: this.state.direccion,
      password: this.state.password,
    };

    console.log('Data to send:', dataToSend);

    try {
      const response = await axios.post(`${dirpagip}:3002/insertar-usuario`, dataToSend);
      console.log('Data sent successfully:', response.data);
      this.setState({
        id: '',
        nombre: '',
        apellidos: '',
        edad: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
      });
      Cookies.remove('fingerprintId');
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  componentDidMount() {
    if (!cookies.get('usuario')) {
      window.location.href = "./";
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <form onSubmit={this.handleSubmit} className="rounded p-4" style={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', width: '80%', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="mb-4">REGISTRO DE USUARIOS</h2>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={this.state.nombre}
              onChange={this.handleChange}
              required
            />
          </div>
              <div className="mb-3">
                <label htmlFor="apellidos" className="form-label">
                  Apellidos
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="apellidos"
                  name="apellidos"
                  value={this.state.apellidos}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edad" className="form-label">
                  Edad
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edad"
                  name="edad"
                  value={this.state.edad}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  name="correo"
                  value={this.state.correo}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={this.state.telefono}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={this.state.direccion}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                Contraseña
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contrasena"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <input
              type="text"
              className="form-control me-3"
              id="id"
              name="id"
              value={this.props.fingerprintId}
              disabled
              required
            />
          </div>
          <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  ENVIAR
                </button>
          </div>
        </form>
        <button onClick={this.handleEnrollButton} className="btn btn-success mt-3">
          ENROLAR HUELLA
        </button>
      </div>
    );
  }
}

function App() {
  const [fingerprintId, setFingerprintId] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
  try {
    const response = await axios.get(`${dirpagip}:3001/latest-id`); // Cambia la URL a la del servidor
    setFingerprintId(response.data.id);

// Guarda la última ID en una cookie
  if (response.data.id !== null) {
    cookies.set('fingerprintId', response.data.id);
  }
  } catch (error) {
  console.error('Error fetching latest ID:', error);
  }
};

    fetchData(); // Llama a la función para obtener los datos al cargar el componente

    // Establece un intervalo para actualizar la ID periódicamente
    const interval = setInterval(fetchData, 5000); // Actualiza cada 5 segundos

    // Limpia el intervalo cuando el componente se desmonta
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    // Al recargar la página, forzar el estado de la ID a null
    setFingerprintId(null);
  }, [window.location.href]); // Agregamos window.location.href al array de dependencias

  return (
    <div className="App" style={{ width: '50%', margin: '0 auto' }}>
      {/* Encabezado oculto
      <header className="App-header">
        <h1>Fingerprint Enrollment</h1>
        {fingerprintId !== null ? (
          <p>Last enrolled fingerprint ID: {fingerprintId}</p>
        ) : (
          <p>Loading...</p>
        )}
      </header>
      */}
      <Usuarios fingerprintId={fingerprintId} />
    </div>
  );
}

export default App;