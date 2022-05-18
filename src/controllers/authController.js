const jwt = require('jsonwebtoken');
//Importar Modulos
const userModel = require('../models/user');
//const user_catModel = require('../models/user_catModel');
const session_tokenModel = require('../models/session_tokenModel');

const { random_secret_key } = require('../libs/jwt_secret_random_key');

class AuthController {

    // Valida el token para permitir navegación en el frontend
    verifyNavigation = async (req, res) => {
        return res.status(200).json({});
    }

    // Login
    signIn = async (req, res) => {

        try {

            //const userFound = await userModel.findOne({email: req.body.email}).populate("roles"); // Recorre los roles y ve lo que hay dentro 'poblarlos'
            const userFound = await userModel.findOne({ email: req.body.email }) /*.populate("roles")*/;
            //console.log(userFound);

            if (!userFound) { // Sino se encuentra el usuario
                return res.status(400).json({ message: 'Usuario no encontrado' });
            }

            const matchPassword = await userModel.comparePassword(req.body.password, userFound.password)

            if (!matchPassword) { // Sino coinciden las contraseñas
                return res.status(400).json({ token: null, message: 'Invalid password' });
            }

            // Validar si existe una sesion anterior registrada en la colección 'sessiontokens'

            // Si si, eliminar todas las sesiones existentes según el id del usuario
            const removePreviewSessions = await session_tokenModel.deleteMany({ user_id: userFound._id });
            //console.log(removePreviewSessions);
            //return res.status(201).json({ removePreviewSessions, message: ''});

            const random_password = random_secret_key();
            //console.log(random_password);

            // Generar el token lleva en el payload el user.id
            const token = jwt.sign({ id: userFound._id }, random_password, {
                expiresIn: 3600 // 1 hora 1*3600
            });
            //console.log(token);

            const newSession = new session_tokenModel({
                user_id: userFound._id,
                token: token,
                secret_key: random_password
            });

            await newSession.save();

            return res.status(201).json({ token });

        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }

    }

    // Logout
    signOut = async (req, res) => {

        try {

            //console.log(req.headers)

            const authorization = req.headers["authorization"];
            //console.log(authorization)

            //Crear variable que me representa el token
            let token = null;
            //Obtener cabecera de la petición
            if (authorization != null && authorization != undefined) {
                let arrayAuth = authorization.split(" ");
                //console.log(arrayAuth[1])
                token = arrayAuth[1];
                //console.log(token);
            }

            //console.log('token '+token)

            if (!token) { // Sino existe el token
                return res.status(401).json({ message: 'No token provided (logout)' });
            }

            const tokenFound = await session_tokenModel.findOne({ token: token });
            //console.log('Token Found ',tokenFound);

            // Se decodifica el token usando el secret
            const decodedToken = jwt.verify(token, tokenFound.secret_key);
            //console.log(decodedToken);

            if (decodedToken) {
                const removePreviewSessions = await session_tokenModel.deleteMany({ user_id: decodedToken.id });
                //console.log(removePreviewSessions);
                return res.status(200).json({ message: 'Ha salido correctamente del sistema', removePreviewSessions });
            }

        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }

    }

}

module.exports = AuthController;