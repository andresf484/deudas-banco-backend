const { Router } = require('express');
const deudasController = require('../controllers/deudasController');

const { verifyToken } = require('../middlewares/authJwt');

class deudasRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }
    #config() {
        const objDeudasC = new deudasController();

        this.router.get('/deudas', verifyToken, objDeudasC.getAllDeudas);
        this.router.post('/deudas', verifyToken, objDeudasC.createDeudas);

        this.router.post('/detalle-deuda', verifyToken, objDeudasC.getDeudaById);
        this.router.get('/bancos-usuario', verifyToken, objDeudasC.getBancosByUser);
        this.router.post('/deudas-por-banco', verifyToken, objDeudasC.getDeudasByUserAndBanco);
        this.router.post('/abono-deuda', verifyToken, objDeudasC.createAbonoDeuda);

    }

}

module.exports = deudasRouter;