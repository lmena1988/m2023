/* eslint-disable no-undef */
// Importaciones necesarias
import React, { useEffect } from "react";
import { direccionCam } from "../constantes"
import Cookies from 'universal-cookie';
import '../Styles.css';

const cookies = new Cookies(); // Cookies para el control de ingreso

export default function Camaras() {
  // Ejecución inicial automática al iniciar la página
  useEffect(() => {
    // Verifica si está ingresado y si no, entonces lo redirige al login
    if (!cookies.get('usuario')) {
      window.location.href = "./";
    }
  }, []);

  return (
    <>
      <div id="layoutSidenav_content">
        <main>
        <div className="container-fluid px-4">
            <h1 className="mt-4"><i className="fas fa-video"></i>&nbsp;CÁMARA</h1>
            <div className="custom-camera-box">
              <img id="cam" src={`${direccionCam}:81/stream`} alt="" />
            </div>
            <br />
            <div>
              <a className=" text-dark" href="./dashboard">
                <i className="fas fa-angle-left"></i>
                &nbsp;Home
              </a>
            </div>
            <br />
          </div>
        </main>
      </div>
    </>
  );
}
