import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import '../Styles.css';
import { dirpagip } from "../constantes"

const cookies = new Cookies();

function DashBoard() {
    const [userCount, setUserCount] = useState(0); // Estado para almacenar la cantidad de usuarios
    const [userList, setUserList] = useState([]); // Estado para almacenar la lista de usuarios

    useEffect(() => {
        if (!cookies.get('usuario')) {
            window.location.href = "./";
        }

        // Realizar la consulta de la lista de usuarios y la cantidad de usuarios registrados aquí
        // Asumimos que la respuesta contiene la cantidad de usuarios en 'cantidadRegistrados' y la lista en 'usuarios'
        fetch(`${dirpagip}:3002/listusu`)
            .then(response => response.json())
            .then(data => {
                // Actualizar el estado con la cantidad de usuarios y la lista de usuarios
                setUserCount(data.cantidadRegistrados);
                setUserList(data.usuarios);
            })
            .catch(error => {
                // Manejar errores de la consulta
                console.error(error);
            });
    }, []);

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4"><i className="fas fa-home"></i>&nbsp;HOME</h1>
                    <div className="contenedor">
                        <div className="caja">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Crear Usuario</h5>
                                    <p className="card-text">Aquí puedes crear un nuevo usuario.</p>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => window.location = "/usuarios"}
                                    >
                                        CREAR USUARIO
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="caja2">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Listado de Usuarios</h5>
                                    <p className="card-text">Ver la lista de usuarios existentes.</p>
                                    <p> </p>
                                    {/* Mostrar la lista de usuarios si existe */}
                                    {userList && userList.length > 0 && (
                                        <ul>
                                            {userList.map(user => (
                                                <li key={user.id}>{user.nombre}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => window.location = "/ListadoU"}
                                    >
                                        USUARIOS:  {userCount}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default React.memo(DashBoard);
