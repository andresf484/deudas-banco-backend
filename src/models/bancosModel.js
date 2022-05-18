const { Schema, model } = require('mongoose');

const bancosSchema = Schema({
    nombre: {
        type: String
    },
    slug: {
        type: String
    },
}, { timestamps: true,  collection: 'bancos' });

module.exports = model('bancos', bancosSchema);