const { Router } = require('express');
const UserController = require('../controllers/userController');

const { verifyToken } = require('../middlewares/authJwt');

class UserRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }
    #config() {
        const objUserC = new UserController();

        this.router.get('/users', verifyToken, objUserC.getAllUsers);
        this.router.post('/users', verifyToken, objUserC.createUser);
    }

}

module.exports = UserRouter;