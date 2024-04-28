 // middlewares.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename); //obtiene directorio especifico
const __dirname = path.resolve(); //obtiene directorio en general o donde se encuentre
const JWT_SECRET = 'secreto_ultra_secreto'; // Secreto para firmar el token JWT

export default function setupMiddlewares(app) {
  // Middleware para archivos estáticos
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(express.static(path.join(__dirname, 'src', 'views')));  
  // Servir archivos estáticos de Bootstrap y jQuery
  // app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // Bootstrap JavaScript
  // app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // jQuery
  app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // Bootstrap CSS
  app.use(
    fileUpload({
      limits: 5000000,
      abortOnLimit: true,
      responseOnLimit: "El tamaño de la imagen supera el límite permitido",
      })
  );
  // Middleware para el análisis de cuerpos JSON
  app.use(bodyParser.json());
  // Middleware de manejo de errores global
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Ha ocurrido un error en el servidor');
  });
// Configuración de Handlebars
app.engine('.hbs', exphbs.engine({ // Establece Handlebars como el motor de vistas
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'), // Ruta para los layouts
  partialsDir: [
    path.join(__dirname, 'src', 'views') // Ruta para los parciales
  ]  
}));
app.set('view engine', '.hbs'); // Establece Handlebars como el motor de vistas
app.set('views', path.join(__dirname, 'src', 'views')); // Define la carpeta de vistas para las plantillas Handlebars

  // Middleware para verificar el token JWT
  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).send('Token no proporcionado');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send('Token inválido');
      req.agentEmail = decoded.email;
      next();
    });
  };

  // Función para manejar rutas restringidas
  const restrictedRoute = (req, res) => {
    res.send(`<h1>Bienvenido ${req.agentEmail} a la zona restringida</h1>`);
  };

  // Exportar middleware y funciones
  return { verifyToken, restrictedRoute };
}
