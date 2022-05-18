const bancosModel = require('../models/bancosModel');

class BancosController {

    getAllBancos = async (req, res) => {
        try {
            const data = await bancosModel.find();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }
    }

    createBanco = async (req, res) => {

        try {

            const { nombre, slug } = req.body;

            const nameFound = await bancosModel.findOne({ nombre: nombre });
            if (nameFound) {
                return res.status(400).json({ message: 'Este nombre ya existe' });
            }

            const newBanco = new bancosModel({
                nombre: nombre,
                slug: slug
            });

            const savedBanco = await newBanco.save();

            return res.status(201).json({ message: 'Banco creado correctamente', savedBanco });

        } catch (error) {
            return res.status(500).json({ message: 'Error al hacer el registro', error });
        }

    }

}

module.exports = BancosController;