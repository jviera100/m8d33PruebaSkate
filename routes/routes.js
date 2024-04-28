import { Router } from 'express';
import { postLoginControl, getLoginControl, registroControl, addSkaterControl, getAdmin, getPerfil, homeControl } from '../src/controllers/ApiRestFull.js';

const router = Router();

// Rutas para el controlador de inicio de sesión y registro
router.post('/login', postLoginControl); // Procesamiento del inicio de sesión
router.get('/login', getLoginControl);   // Renderizado de la vista de inicio de sesión
router.get('/registro', registroControl); // Renderizado de la vista de registro

// Rutas para el controlador de skaters
router.post('/skaters', addSkaterControl);

// Rutas para el controlador de administrador y perfil
router.get('/admin', getAdmin);
router.get('/perfil/:email', getPerfil);

// Ruta por defecto para la página de inicio
router.get('/', homeControl);

export default router;
