// Sirve para saber si el usuario si nos está mandando su token
// Verificar si el usuario tiene un token y saber que rol tiene

const jwt = require('jsonwebtoken');

const userModel = require('../models/user');
const session_tokenModel = require('../models/session_tokenModel');

const verifyToken = async (req, res, next) => {

    try {

        //console.log(req.headers)

        const authorization = req.headers["authorization"];
        //console.log(authorization);

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

        if(!token){ // Sino existe el token
            return res.status(401).json({message: 'No token provided'});
        }

        // Se valida si existe el token en la colección 'sessiontokens'
        const tokenFound = await session_tokenModel.findOne({token: token});
        //console.log('Token Found '+tokenFound);
        
        if(!tokenFound){ // Si no se encuentra el token en la colección 'sessiontokens'
            return res.status(401).json({message: 'Unauthorized / Este token no existe en la colección: sessiontokens'});
        }

        // Se decodifica el token usando el secret
        const decodedToken = jwt.verify(token, tokenFound.secret_key);
        //console.log(decodedToken);

        // Busqueda por id para saber si el usuario del token existe
        const user = await userModel.findById(decodedToken.id, {password: 0}); // No deseo ver el password
        //console.log(user);

        if(!user){ // Si el usuario no existe
            return res.status(404).json({message: 'No user found'});
        }else{// Si el usuario existe
              // Permite acceder al contenido
            
            next(); // Continua el código
            return; // Respuesta true
        }

    } catch (error) {
        return res.status(401).json({message: 'Unauthorized', error});
    }

}

module.exports = {
    verifyToken
}