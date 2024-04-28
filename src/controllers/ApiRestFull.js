//ApiRestFull.js
import path from 'path';
import { addSkaterQuery, getSkatersQuery, getSkaterByIdQuery } from '../queries/consultaSQL.js';
import jwt from 'jsonwebtoken';

const __dirname = path.resolve();

const addSkaterControl = async (req, res) => {
    try {
        console.log('Iniciando proceso de añadir skater...');
        const { email, nombre, password, anos_experiencia, especialidad } = req.body;
        const { foto } = req.files;
        
        if (!foto) {
            throw new Error('No se ha proporcionado un archivo de imagen');
        }
        
        const { name } = foto;
        const pathPhoto = `img/${name}`;
        
        console.log('Moviendo archivo de imagen...');
        foto.mv(`${__dirname}/assets/${pathPhoto}`, async (err) => {
            if (err) {
                throw new Error('Error al cargar la imagen');
            }
            
            console.log('Imagen movida exitosamente.');
            console.log('Añadiendo skater a la base de datos...');
            const skater = { email, nombre, password, anos_experiencia, especialidad, foto: pathPhoto };
            await addSkaterQuery(skater);
            console.log('Skater añadido exitosamente.');
            res.status(201).redirect('/login');
        });
    } catch (error) {
        console.error('Error al añadir skater:', error);
        res.status(500).send(error.message);
    }
};

const getLoginControl = async (req, res) => {
    try {
        console.log('Cargando vista de inicio de sesión...');
        res.render('Login');
    } catch (error) {
        console.error("Error al cargar la vista de inicio de sesión:", error.message);
        res.status(500).send('Ocurrió un error al cargar la vista de inicio de sesión');
    }
};

const postLoginControl = async (req, res) => {
    try {
        console.log('Iniciando sesión...');
        const { id, password } = req.body;
        console.log('ID del usuario:', id);
        console.log('Contraseña:', password);

        // Buscar al usuario por ID en lugar de por email
        const skater = await getSkaterByIdQuery(id);

        if (!skater) {
            console.log('Credenciales inválidas.');
            return res.status(401).send('Credenciales inválidas');
        }

        console.log('Usuario autenticado:', skater);
        const token = jwt.sign({ userId: skater.id, email: skater.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log('Token generado:', token);
        res.cookie('token', token); // Almacenar el token en una cookie
        console.log('Cookie de token creada.');
        res.redirect(`/perfil/${skater.id}`); // Redireccionar por ID
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(500).send('Ocurrió un error al iniciar sesión: ' + error.message);
    }
};



const getAdmin = async (req, res) => {
    try {
        console.log('Obteniendo lista de skaters para el administrador...');
        const skaters = await getSkatersQuery();
        console.log('Lista de skaters obtenida con éxito.');
        res.render('Admin', { skaters });
    } catch (error) {
        console.error('Error al obtener la lista de skaters:', error.message);
        res.status(500).send('Error al obtener la lista de skaters: ' + error.message);
    }
};

const getPerfil = async (req, res) => {
    try {
        console.log('Obteniendo perfil del usuario...');
        const { id } = req.params;
        console.log('ID del usuario:', id);

        // Aquí puedes agregar la lógica para obtener el perfil del usuario basándote en el ID
        const skater = await getSkaterByIdQuery(id);
        console.log('Perfil del usuario obtenido:', skater);
        
        if (!skater) {
            console.log('Usuario no encontrado.');
            throw new Error('Usuario no encontrado');
        }

        res.render('perfil', { skater });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).send('Error al obtener el perfil del usuario: ' + error.message);
    }
};


const homeControl = async (req, res) => {
    try {
        console.log('Cargando vista principal...');
        const skaters = await getSkatersQuery();
        console.log('Vista principal cargada exitosamente.');
        res.render('Home', { skaters });
    } catch (error) {
        console.error('Error al obtener la lista de skaters:', error.message);
        res.status(500).send('Error al obtener la lista de skaters: ' + error.message);
    }
};

const registroControl = (req, res) => {
    console.log('Cargando vista de registro...');
    res.render("Registro");
};

export { addSkaterControl, getLoginControl, postLoginControl, getAdmin, getPerfil, homeControl, registroControl };
