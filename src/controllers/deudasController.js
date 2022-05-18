const jwt = require('jsonwebtoken');

const deudasModel = require('../models/deudasModel');
const bancosModel = require('../models/bancosModel');

const session_tokenModel = require('../models/session_tokenModel');


class DeudasController {

    getAllDeudas = async (req, res) => {
        try {
            const data = await deudasModel.find();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }
    }

    getDeudaById = async (req, res) => {
        try {
            const { deuda_id } = req.body;
            const data = await deudasModel.findById(deuda_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }
    }

    getBancosByUser = async (req, res) => {

        try {

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
                return res.status(401).json({ message: 'No token provided (getBancosByUser)' });
            }

            const tokenFound = await session_tokenModel.findOne({ token: token });
            //console.log('Token Found ',tokenFound);

            if(!tokenFound){ // Sino se encuentra el token en la colección 'sessiontokens'
                return res.status(401).json({message: 'Unauthorized / Este token no existe en la colección: sessiontokens'});
            }

            // Se decodifica el token usando el secret
            //const decodedToken = jwt.verify(token, config.SECRET);
            const decodedToken = jwt.verify(token, tokenFound.secret_key);
            //console.log(decodedToken);

            const data = await deudasModel.find({ usuario_id: decodedToken.id }  ) /*.distinct("banco_slug")*/ /*.populate("banco_id") */ ;

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }

    }

    getDeudasByUserAndBanco = async (req, res) => {

        try {

            const { banco_slug } = req.body;

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
                return res.status(401).json({ message: 'No token provided (getDeudasByUserAndBanco)' });
            }

            const tokenFound = await session_tokenModel.findOne({ token: token });
            //console.log('Token Found ',tokenFound);

            if(!tokenFound){ // Sino se encuentra el token en la colección 'sessiontokens'
                return res.status(401).json({message: 'Unauthorized / Este token no existe en la colección: sessiontokens'});
            }

            // Se decodifica el token usando el secret
            //const decodedToken = jwt.verify(token, config.SECRET);
            const decodedToken = jwt.verify(token, tokenFound.secret_key);
            //console.log(decodedToken);

            const data = await deudasModel.find({ usuario_id: decodedToken.id, banco_slug: banco_slug }, { /* banco_id : 1 */ }) /* .distinct("banco_id") */ /* .populate("banco_id") */ ;

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ "Error Type": error.name, "Detalle": error.message });
        }

    }

    createDeudas = async (req, res) => {

        try {

            const { usuario_id, banco_slug, cuotas_totales, deuda_total } = req.body;

            const newDeuda = new deudasModel({
                usuario_id: usuario_id,
                banco_slug: banco_slug,
                cuotas_totales: cuotas_totales,
                cuotas_pendientes: cuotas_totales, // Clonado
                deuda_total: deuda_total,
                deuda_pendiente: deuda_total, // Clonado
            });

            const savedDeuda = await newDeuda.save();

            return res.status(201).json({ message: 'Deuda creada correctamente', savedDeuda });

        } catch (error) {
            return res.status(500).json({ message: 'Error al hacer el registro', error });
        }

    }

    createAbonoDeuda = async (req, res) => {

        try {
            
            const { deuda_id, valor_pago, cuotas_a_pagar } = req.body;

            const deuda = await deudasModel.findById(deuda_id);

            const updatedDeuda = await deudasModel.findByIdAndUpdate(deuda_id, {
                cuotas_pendientes: deuda.cuotas_pendientes - cuotas_a_pagar,
                deuda_pendiente: deuda.deuda_pendiente - valor_pago,
                pago_acumulado: deuda.pago_acumulado + valor_pago,
            }, { new: true });

            if (updatedDeuda != null) {
                return res.status(201).json(updatedDeuda);
            } else {
                // Si el id no se encuentra en DB y la consulta es vacia
                return res.status(400).json({ message: 'Erroe al actualizar la deuda' });
            }

        } catch (error) {
            return res.status(500).json({ message: 'Error al hacer el registro', error });
        }

    }

}

module.exports = DeudasController;