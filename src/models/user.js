const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Number,
        default: 0,
        enum: { values: [0, 1], message: '{VALUE} is not supported' }
        // 0: deshabilitado, 1: activo
    }
}, { timestamps: true, collection: 'users' });

// Cifrar contraseña al crear el usuario   // Contraseña ingresada por el usuario al crear la cuenta
userSchema.statics.encryptPassword = async (password) => {

    const salt = await bcrypt.genSalt(10); // String generado para cifrar la contraseña
    const hash = await bcrypt.hash(password, salt); // El hash es el dato cifrado
    return hash; // Se guarda la contraseña cifrada
};

// Comparar contraseñas                    // contraseña guardada, contraseña nueva
userSchema.statics.comparePassword = async (password, receivedPassword) => {  // Se recibe la contraseña que nos pasa el usuario

    // Se compara la contraseña pasada por el usuario 'paswword', con la actual almacenada en BD 'this.password'
    return await bcrypt.compare(password, receivedPassword); // Si coinciden devuelve true, sino false
};

module.exports = model('User', userSchema);
