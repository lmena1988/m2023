const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); // Importa el módulo body-parser
const cors = require('cors'); // Importa el paquete cors
const bcrypt = require('bcrypt'); // Importa la librería bcrypt para el hashing de contraseñas

const app = express();
const port = process.env.PORT || 3002;

const Cookies = require('universal-cookie');
const cookies = new Cookies();

// Elimina la cookie 'usuario' (ajústala según el nombre de tu cookie) al iniciar el servidor
cookies.remove('usuario', { path: '/' });
console.log('Cookies eliminadas al iniciar el servidor.');

// Configura el middleware body-parser para analizar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Habilita CORS para permitir solicitudes desde http://localhost:3000 o por ip pc host
/*app.use(cors({ origin: 'http://192.168.1.27:3000' }));*///
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//base de datos para admins pag.
const db = mysql.createConnection({
  host: 'localhost', // Cambia esto por la dirección de tu base de datos
  user: 'root', // Cambia esto por tu usuario de base de datos
  password: '', // Cambia esto por tu contraseña de base de datos
  database: 'admins', // Cambia esto por el nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

//base de datos para usuarios huella
const db2 = mysql.createConnection({
  host: 'localhost', // Cambia esto por la dirección de tu base de datos
  user: 'root', // Cambia esto por tu usuario de base de datos
  password: '', // Cambia esto por tu contraseña de base de datos
  database: 'sisthuellero', // Cambia esto por el nombre de tu base de datos
});

db2.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

// Define una ruta para autenticar a los usuarios mediante POST
app.post('/autenticar', (req, res) => {
  const { usuario, clave } = req.body;

  // Consulta la base de datos para verificar las credenciales del usuario
  db.query(
    'SELECT * FROM usuarios WHERE user = ? AND pass = ?',
    [usuario, clave],
    (err, result) => {
      if (err) {
        console.error('Error al consultar la base de datos: ' + err.message);
        res.status(500).send('Error al autenticar al usuario');
      } else {
        if (result.length > 0) {
          // Las credenciales son válidas, envía una respuesta con éxito
          res.json({ esValido: true });
        } else {
          // Las credenciales son inválidas, envía una respuesta con fallo
          res.json({ esValido: false });
        }
      }
    }
  );
});

app.post('/insertar-usuario', (req, res) => {
  // Obtener los datos enviados como JSON
  const { id, nombre, apellidos, edad, correo, telefono, direccion, password } = req.body;

  // Insertar los datos en la base de datos
  const sql = `INSERT INTO usuarios (id, nombre, apellidos, edad, correo, telefono, direccion, password) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db2.query(sql, [id, nombre, apellidos, edad, correo, telefono, direccion, password], (err, result) => {
    if (err) {
      console.error('Error al insertar datos: ' + err.message);
      res.status(500).send('Error al insertar datos en la base de datos');
    } else {
      console.log('Datos insertados correctamente');
      res.json({ message: 'Datos insertados correctamente' });
    }
  });
});

// Define las rutas para manejar las solicitudes de la base de datos
app.get('/usuarios', (req, res) => {
  // Consulta la base de datos para obtener la lista de usuarios
  db2.query('SELECT * FROM usuarios', (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err.message);
      res.status(500).send('Error al consultar la base de datos');
    } else {
      res.json(result);
    }
  });
});

app.get('/listusu', (req, res) => {
  // Consulta la base de datos para obtener la cantidad de usuarios registrados
  db2.query('SELECT COUNT(*) as cantidadRegistrados FROM usuarios', (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err.message);
      res.status(500).send('Error al consultar la base de datos');
    } else {
      // Devuelve la cantidad de usuarios registrados como respuesta
      res.json(result[0]); // Resultado es un arreglo, toma el primer elemento
    }
  });
});

app.put('/editar-usuario/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  // Actualiza el usuario en la base de datos
  db2.query('UPDATE usuarios SET ? WHERE id = ?', [updatedUser, id], (err, result) => {
    if (err) {
      console.error('Error al editar el usuario: ' + err.message);
      res.status(500).send('Error al editar el usuario');
    } else {
      res.json({ message: 'Usuario actualizado correctamente' });
    }
  });
});

// Define una ruta para eliminar un usuario mediante DELETE
app.delete('/eliminar-usuario/:id', (req, res) => {
  const { id } = req.params;

  // Elimina el usuario de la base de datos
  db2.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario: ' + err.message);
      res.status(500).send('Error al eliminar el usuario');
    } else {
      res.json({ message: 'Usuario eliminado correctamente' });
    }
  });
});

//llamada al nodemcu:

app.get('/verificar-id/:id', (req, res) => {
  const id = req.params.id;

  db2.query('SELECT nombre, password FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err.message);
      res.status(500).send('Error al verificar la ID');
    } else {
      if (result.length > 0) {
        const nombre = result[0].nombre;
        const password = result[0].password;
        res.json({ estado: 'EXIST', nombre: nombre, password: password });
      } else {
        res.json({ estado: 'NOT_EXIST', error: 'No se encontró ningún registro para la ID proporcionada.' });
      }
    }
  });
});

app.get('/verificar', (req, res) => {
  // Consulta la base de datos para obtener todas las IDs existentes
  db2.query('SELECT id FROM usuarios', (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err.message);
      res.status(500).send('Error al verificar la ID');
    } else {
      const existingIds = result.map((row) => row.id); // Extrae las IDs existentes de la consulta
      res.json({ existingIds: existingIds });
    }
  });
});

app.post('/modificar-login', async (req, res) => {
  const { usuario, claveActual, nuevoUsuario, nuevaClave } = req.body;

  try {
    // Verificar si el usuario existe
    const userQuery = 'SELECT * FROM usuarios WHERE user = ?';
    const [userRows] = await db.query(userQuery, [usuario]); 

    if (userRows.length === 0) {
      // El usuario no existe, envía una respuesta con fallo
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const hashedPassword = userRows[0].password; // Cambiar a "password" en lugar de "pass"
    const isPasswordValid = await bcrypt.compare(claveActual, hashedPassword);

    if (!isPasswordValid) {
      // Las credenciales son inválidas, envía una respuesta con fallo
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Si llegamos aquí, el usuario existe y las credenciales son válidas
    // Puedes continuar para actualizar el usuario y/o contraseña
    const hashedNuevaClave = await bcrypt.hash(nuevaClave, 10);

    // Actualizar los datos de inicio de sesión en la base de datos
    const updateQuery = 'UPDATE usuarios SET user = ?, password = ? WHERE user = ?'; // Cambiar "pass" a "password"
    await db.query(updateQuery, [nuevoUsuario, hashedNuevaClave, usuario]); // Usar db2 en lugar de db

    // Datos de inicio de sesión actualizados correctamente
    res.json({ mensaje: 'Datos de inicio de sesión actualizados correctamente' });
  } catch (err) {
    // Manejo de errores
    console.error(err.message);
    res.status(500).json({ mensaje: 'Error en la actualización de los datos de inicio de sesión' });
  }
});

// Escucha en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

