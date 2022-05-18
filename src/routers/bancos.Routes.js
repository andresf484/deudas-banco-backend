const { Router } = require('express');
const bancosController = require('../controllers/bancosController');

const { verifyToken } = require('../middlewares/authJwt');

class bancosRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }
    #config() {
        const objBancosC = new bancosController();

        this.router.get('/bancos', verifyToken, objBancosC.getAllBancos);
        this.router.post('/bancos', verifyToken, objBancosC.createBanco);

    }

}

module.exports = bancosRouter;