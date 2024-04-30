//<!-- db.js -->
import pg from 'pg';
const {Pool} = pg; 
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config(); 
// process.loadEnvFile(); // no es compatible en render para subir db de neon
 
//const { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD } = process.env; //db postgre
const { PGHOST, PGDATABASE, DB_PORT, PGUSER, PGPASSWORD } = process.env; //db neon

 const config = {
     host: PGHOST,
     database: PGDATABASE,
     port: DB_PORT,   
     user: PGUSER,
     password: PGPASSWORD,     
     allowExitOnIdle: true,  
     ssl: {
        rejectUnauthorized: false,
      }
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