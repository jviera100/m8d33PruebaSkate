//<!-- index.js -->
import express from "express";
import chalk from "chalk";
import router from "./routes/routes.js";
import setupMiddlewares from './middlewares/middlewares.js';

process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Configuración de la carpeta estática y los middlewares
setupMiddlewares(app);
//Routes
app.use("/", router);

app.listen(PORT, () => console.log(chalk.underline.bgCyanBright.magenta.bold.italic(`Servidor conectado a puerto: ${PORT}`)));
