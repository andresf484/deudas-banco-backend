const { Schema, model } = require('mongoose');

const deudasSchema = Schema({
    usuario_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },

    /*banco_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "bancos",
    },*/

    banco_slug: {
        type: String,
        required: true,
    },

    cuotas_totales: { // 12
        type: Number,
        required: true,
        default: 0
    },

    cuotas_pendientes: { // 11
        type: Number,
        required: true,
        default: 0
    },

    deuda_total: { // 1.200.000
        type: Number,
        required: true,
        default: 0
    },

    deuda_pendiente: {  // 1.000.000
        type: Number,
        required: true,
        default: 0
    },

    pago_acumulado: { // 200.000
        type: Number,
        required: true,
        default: 0
    },

}, { timestamps: true, collection: 'deudas' });

module.exports = model('deudas', deudasSchema);