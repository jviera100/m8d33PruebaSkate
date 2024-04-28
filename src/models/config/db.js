//<!-- db.js -->
import pg from 'pg';
const {Pool} = pg; 
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config(); 
process.loadEnvFile();
 
const { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

 const config = {
     host: DB_HOST,
     database: DB_DATABASE,
     port: DB_PORT,   
     user: DB_USER,
     password: DB_PASSWORD,
     allowExitOnIdle: true,
 }
 const pool = new Pool(config);

 pool.connect((err, client, release) => {
     if (err) {
         return console.error('Error al conectarse a la base de datos:', err.stack);
     }
     console.log(chalk.underline.bgCyanBright.magenta.bold.italic('\nConexión con la base de datos establecida.'));
     release();
 });
export default pool