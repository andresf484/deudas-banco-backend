//Importar dependencias
const jwt = require('jsonwebtoken');
//Importar Modulos
const usersModel = require('../models/user');

class UserController {

    getAllUsers = async (req, res) => {

        try {
            const users = await usersModel.find( {}, { password: 0 } ); // No deseo ver el password - https://stackoverflow.com/a/14559323
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }

    }

    createUser = async (req, res) => {

        try {

            const { name, email, password } = req.body;

            // Validar si el usuario ya existe, antes de guardar
            const emailFound = await usersModel.findOne({ email: email });
            if (emailFound) {
                return res.status(400).json({ message: 'El email ya existe' });
            }

            // encriptando la contraseña
            const encryptedPassword = await usersModel.encryptPassword(password);

            const newUser = new usersModel({
                name: name,
                email: email,
                password: encryptedPassword,
                status: 1
            });

            const savedUser = await newUser.save();

            return res.status(201).json({ message: 'Usuario creado correctamente', savedUser });

        } catch (error) {
            return res.status(500).json({ message: 'Error al hacer register', error });
        }

    }

}

module.exports = UserController;