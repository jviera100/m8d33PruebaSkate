// <!-- db.js -->
import pg from 'pg';
const { Pool } = pg;
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

// Cargamos las variables de entorno
const { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD, PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Configuración para la base de datos local y remota
const config = {
    local: {
        host: DB_HOST,
        database: DB_DATABASE,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD
    },
    remote: {
        host: PGHOST,
        database: PGDATABASE,
        port: DB_PORT,
        user: PGUSER,
        password: PGPASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    }
};

// Función para obtener la configuración según el entorno (local o remoto)
const getConfig = () => {
    if (process.env.NODE_ENV === 'production') {
        return config.remote;
    } else {
        return config.local;
    }
};

// Creamos el pool de conexiones utilizando la configuración correspondiente
const pool = new Pool(getConfig());

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectarse a la base de datos:', err.stack);
    }
    console.log(chalk.underline.bgCyanBright.magenta.bold.italic('\nConexión con la base de datos establecida.'));
    release();
});

export default pool;
