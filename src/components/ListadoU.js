import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { dirpagip } from "../constantes"
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from 'reactstrap';

const cookies = new Cookies();

function ListadoU() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalData, setModalData] = useState({ form: {}, modalActualizar: false });
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    if (!cookies.get('usuario')) {
      window.location.href = './';
    }

    fetch(`${dirpagip}:3002/usuarios`)
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      });
  }, []);

  function mostrarModalActualizar(dato) {
    setEditedUser({ ...dato });
    setModalData((prevState) => ({
      ...prevState,
      modalActualizar: true,
    }));
  }

  function cerrarModalActualizar() {
    setModalData((prevState) => ({
      ...prevState,
      modalActualizar: false,
    }));
  }

  function handleEditInputChange(event) {
    const { name, value } = event.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function editarUsuario() {
    fetch(`${dirpagip}:3002/editar-usuario/${editedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Usuario editado correctamente', data);
        cerrarModalActualizar();
        // Aquí puedes actualizar la lista de usuarios si lo deseas
      })
      .catch((error) => {
        console.error('Error al editar el usuario:', error);
      });
  }

  function eliminar(usuario) {
    fetch(`${dirpagip}:3002/eliminar-usuario/${usuario.id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios((prevState) => prevState.filter((u) => u.id !== usuario.id));
      })
      .catch((error) => {
        console.error('Error al eliminar el usuario:', error);
      });
  }

  const editarModal = (
    <Modal isOpen={modalData.modalActualizar} toggle={cerrarModalActualizar}>
      <ModalHeader toggle={cerrarModalActualizar}>Editar Usuario</ModalHeader>
      <ModalBody>
        <FormGroup>
          <label>ID:</label>
          <input
            type="text"
            className="form-control"
            name="id"
            value={editedUser.id}
            readOnly
          />
        </FormGroup>
        <FormGroup>
          <label>Nombre:</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={editedUser.nombre || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Apellidos:</label>
          <input
            type="text"
            className="form-control"
            name="apellidos"
            value={editedUser.apellidos || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Edad:</label>
          <input
            type="number"
            className="form-control"
            name="edad"
            value={editedUser.edad || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Correo:</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={editedUser.correo || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Teléfono:</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={editedUser.telefono || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Dirección:</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={editedUser.direccion || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Contraseña:</label>
          <input
            type="text"
            className="form-control"
            name="password"
            value={editedUser.password || ''}
            onChange={handleEditInputChange}
          />
        </FormGroup>
        {/* Agrega campos adicionales aquí */}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={editarUsuario}>
          Guardar Cambios
        </Button>
        <Button color="secondary" onClick={cerrarModalActualizar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">
            <i className="fas fa-users"></i>&nbsp;LISTADO DE USUARIOS
          </h1>
          <div className="card mb-4">
            <div className="card-body">
              <div className="table-responsive">
                <Container>
                  <Table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Edad</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Contraseña</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellidos}</td>
                          <td>{usuario.edad}</td>
                          <td>{usuario.correo}</td>
                          <td>{usuario.telefono}</td>
                          <td>{usuario.direccion}</td>
                          <td>{usuario.password}</td>
                          <td>
                            <Button
                              color="primary"
                              onClick={() => mostrarModalActualizar(usuario)}
                            >
                              EDITAR
                            </Button>
                            <Button color="danger" onClick={() => eliminar(usuario)}>
                              ELIMINAR
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </main>
      {editarModal}
    </div>
  );
}

export default React.memo(ListadoU);
