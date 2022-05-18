// Archivo de configuración para las variables de entorno (.env)

module.exports = {
    //SECRET_KEY: process.env.JWT_PRIVATE_KEY,
    DB: {
        server: process.env.SERVER_DB,
        user: process.env.USER_DB,
        pass: process.env.PASS_DB,
        database: process.env.DATABASE
    }
}