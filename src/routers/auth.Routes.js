const { Router } = require('express');
const AuthController = require('../controllers/authController');

const { verifyToken } = require('../middlewares/authJwt');

class AuthRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }
    #config() {
        const objAuthC = new AuthController();

        this.router.post('/login', objAuthC.signIn);
        this.router.get('/logout', objAuthC.signOut);

        // Valida el token para permitir navegación en el frontend
        this.router.get('/verify', verifyToken, objAuthC.verifyNavigation);

    }

}

module.exports = AuthRouter;