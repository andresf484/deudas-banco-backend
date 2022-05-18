//Configurar variables de entorno
require('dotenv').config();

// Importar Dependencias
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

//Importar la conexión de la DB
const ConnDb = require('./database/ConnDb');

//Importar Modulos y Clases : Rutas y Clase de Conexion
const AuthRouter = require('./routers/auth.Routes');
const IndexRouter = require('./routers/index.Routes');
const UserRouter = require('./routers/user.Routes');
const BancosRouter = require('./routers/bancos.Routes');
const DeudasRouter = require('./routers/deudas.Routes');

class Server {

    constructor() {
        this.objConn = new ConnDb();
        //Crear aplicación express
        this.app = express();
        this.#config();
    }

    #config() {

        //TODO - Middlewares

        // Para ocultar información sensible del servidor
        this.app.use(helmet());

        // Permitir conexiones desde otros origenes remotos
        this.app.use(cors());

        // Para cuando me envien una petición POST desde un formulario, 
        // pueda entender los campos que vienen desde allí
        this.app.use(express.urlencoded({ extended: false }));

        //Indicar al servidor que procesará datos en formato JSON durante las peticiones http
        this.app.use(express.json());

        //Usar morgan en express para el monitoreo de las peticiones htttp
        this.app.use(morgan('combined'));


        //TODO - Settings

        //Permitir conexiones de origen cruzado
        this.app.set('PORT', process.env.PORT || 3000);

        //------------Crear rutas----------
        let authR = new AuthRouter();
        let indexR = new IndexRouter();
        let userR = new UserRouter();
        let bancosR = new BancosRouter();
        let deudasR = new DeudasRouter();

        //-----------Añadir rutas a express----------
        this.app.use(authR.router);
        this.app.use(indexR.router);
        this.app.use(userR.router);
        this.app.use(bancosR.router);
        this.app.use(deudasR.router);

        //Poner a la escucha el servidor
        this.app.listen(this.app.get('PORT'), () => {
            console.log("Servidor corriendo por el puerto => ", this.app.get('PORT'))
        });
    }

}
new Server();