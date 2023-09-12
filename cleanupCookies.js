const Cookies = require('universal-cookie');

const cookies = new Cookies();

// Eliminar la cookie 'usuario' (ajústala según el nombre de tu cookie)
cookies.remove('usuario', { path: '/' });

console.log('Cookies eliminadas.');

process.exit(); // Esto detendrá el script