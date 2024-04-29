//ApiRestFull.js
import path from 'path';
import { addSkaterQuery, getSkatersQuery, getSkaterByEmailQuery, updateSkaterByEmailQuery, deleteSkaterByEmailQuery } from '../queries/consultaSQL.js';
import jwt from 'jsonwebtoken';

const __dirname = path.resolve();

const homeControl = async (req, res) => {
    try {        
        const skaters = await getSkatersQuery();        
        res.render('Home', { skaters });
    } catch (error) {
        console.error('Error al obtener la lista de skaters:', error.message);
        res.status(500).send('Error al obtener la lista de skaters: ' + error.message);
    }
};
const addSkaterControl = async (req, res) => {
    try {        
        const { email, nombre, password, anos_experiencia, especialidad } = req.body;
        const { foto } = req.files;
        
        if (!foto) {
            throw new Error('No se ha proporcionado un archivo de imagen');
        }
        
        const { name } = foto;
        const pathPhoto = `img/${name}`;        
        
        foto.mv(`${__dirname}/assets/${pathPhoto}`, async (err) => {
            if (err) {
                throw new Error('Error al cargar la imagen');
            }            
            const skater = { email, nombre, password, anos_experiencia, especialidad, foto: pathPhoto };
            await addSkaterQuery(skater);            
            res.status(201).redirect('/login');
        });
    } catch (error) {
        console.error('Error al añadir skater:', error);
        res.status(500).send(error.message);
    }
};
const registroControl = (req, res) => {    
    res.render("Registro");
};
const getLoginControl = async (req, res) => {
    try {        
        res.render('Login');
    } catch (error) {
        console.error("Error al cargar la vista de inicio de sesión:", error.message);
        res.status(500).send('Ocurrió un error al cargar la vista de inicio de sesión');
    }
};
const postLoginControl = async (req, res) => {
    try {        
        const { email, password } = req.body; // Cambiado de `id` a `email`   
        const skater = await getSkaterByEmailQuery(email);

        if (!skater || skater.password !== password) { // Verifica si el usuario existe y si la contraseña coincide            
            return res.status(401).send('Credenciales inválidas');
        }
        const token = jwt.sign({ userId: skater.id, email: skater.email }, process.env.SECRET_KEY, { expiresIn: '1h' });        
        res.cookie('token', token); // Almacena el token en una cookie       
        res.redirect(`/perfil/${skater.email}`); // Redirige al usuario a su perfil        
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(500).send('Ocurrió un error al iniciar sesión: ' + error.message);
    }
};
const getPerfil = async (req, res) => {
    try {
        console.log('Obteniendo perfil del usuario...');
        const { email } = req.params; // Cambiado de `id` a `email`
        console.log('Correo electrónico del usuario:', email);

        // Obtiene el perfil del usuario por su correo electrónico
        const skater = await getSkaterByEmailQuery(email);

        if (!skater) {
            console.log('Usuario no encontrado.');
            throw new Error('Usuario no encontrado');
        }

        console.log('Perfil del usuario obtenido:', skater);
        res.render('Perfil', { skater }); //muestra perfil.hbs con la data
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).send('Error al obtener el perfil del usuario: ' + error.message);
    }
};

const postPerfilControl = async (req, res) => {
    try {
        const { email } = req.params;
        const { action, ...updatedFields } = req.body;

        console.log('Action:', action);
        console.log('Updated Fields:', updatedFields);

        if (action === 'update') {
            // Actualizar perfil utilizando el correo electrónico
            await updateSkaterByEmailQuery(email, updatedFields);
            console.log('Perfil actualizado correctamente.');
            res.status(200).send('Perfil actualizado correctamente.'); // Agregar un mensaje de confirmación
        } else if (action === 'delete') {
            // Eliminar perfil utilizando el correo electrónico
            await deleteSkaterByEmailQuery(email);
            console.log('Perfil eliminado correctamente.');
            res.status(200).send('Perfil eliminado correctamente.'); // Agregar un mensaje de confirmación
        } else {
            console.log('Acción no válida.');
            res.status(400).send('Acción no válida.');
        }
    } catch (error) {
        console.error('Error en postPerfilControl:', error);
        res.status(500).send('Ocurrió un error en el servidor.');
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
export {  homeControl, addSkaterControl, registroControl, getLoginControl, postLoginControl, getPerfil, postPerfilControl, getAdmin };
