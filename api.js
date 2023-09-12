const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

app.use(cors());
app.use(bodyParser.json());

let latestId = null;

app.get('/latest-id', (req, res) => {
  res.json({ id: latestId });
});

app.post('/enroll', (req, res) => {
  const { id } = req.body;
  if (id !== undefined && id !== null) {
    latestId = id; // Actualiza la última ID guardada
    console.log('Received fingerprint ID:', id);
    res.status(200).send('Fingerprint ID received and stored.');

    // Emitir el evento con la nueva ID a todos los clientes
    sendEventToClients(id);
  } else {
    res.status(400).send('Invalid fingerprint ID.');
  }
});

const port = 3001;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Mantener una lista de clientes conectados
const clients = [];

// Función para enviar eventos a todos los clientes
function sendEventToClients(id) {
  clients.forEach(client => {
    client.res.write(`event: fingerprintId\ndata: ${JSON.stringify({ id })}\n\n`);
  });
}

// Configurar la ruta para que los clientes se suscriban a los eventos
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Agregar el cliente a la lista de clientes conectados
  const client = { req, res };
  clients.push(client);

  // Mantener la conexión abierta
  req.on('close', () => {
    const clientIndex = clients.indexOf(client);
    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
    }
  });
});
