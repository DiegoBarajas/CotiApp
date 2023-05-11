const { Schema, model } = require('mongoose');

const schema = new Schema({
    id_usuario: {type: String, required: true},
    id_cliente: {type: String, required: true},
    id_empresa: {type: String, required: true},
    color: {type: String, required: true},
    folio: {type: String, required: true},
    fecha: {type: String, required: true},
    condiciones: {type: String, required: true},
    subtotal: {type: Number, required: true},
    iva: {type: Number, required: true},
    importeIva: {type: Number, required: true},
    descuento: {type: Number, required: true},
    adicional: {type: Number, required: true},
    total: {type: Number, required: true},
    footer: {type: String, required: true},
    plantilla: {type: Number, required: true},
    pago: {type: String, required: true}
},
{
    timestamps: true
});

module.exports = model('tickets', schema);