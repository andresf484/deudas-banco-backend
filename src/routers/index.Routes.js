const express = require('express');

const { verifyToken } = require('../middlewares/authJwt');

class IndexRouter {
    constructor() {
        this.router = express.Router();
        this.#config();
    }

    #config() {
        this.router.get('/', verifyToken, (req, res) => {
            res.status(200).json({ mensaje: 'Conexión exitosa' });
        });
    }
}

module.exports = IndexRouter;