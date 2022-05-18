const mongoose = require('mongoose');

//const { db } = require('./db');

const { DB } = require('../config/configuration');

// Datos de conexion a la base de datos, para produccion van en .env usando  dotenv
const db = `mongodb+srv://${DB.user}:${DB.pass}@${DB.server}/${DB.database}?retryWrites=true&w=majority`;

class ConnDb {
    constructor() {
        this.connection();
    }

    async connection() {
        this.conn = await mongoose.connect(db)
            .then(db => console.log(`DB is connected: ${DB.database}`))
            .catch(error => console.log('Connection error: ',error));
    }
}

module.exports = ConnDb;